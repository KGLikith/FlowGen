require("dotenv").config();

import { Kafka } from "kafkajs";
import {
  AvailableAction,
  AvailableTrigger,
  ExecutionLog,
  ExecutionPhase,
  ExecutionPhaseStatus,
  prisma,
  TaskInfo,
  WorkflowExecutionStatus,
} from "@automation/db";
import { executePhase } from "./executePhase";
import { cleanupEnvironment, getEnvironment } from "./executionEnvironment";
import { Edge } from "./schema/types";
import { AppNode } from "./schema/appnode";
import { createLogCollector } from "./log";

const TOPIC_NAME = "workflow-events";

const kafka = new Kafka({
  clientId: "worker",
  brokers: ["localhost:9092"],
});

async function main() {
  const consumer = kafka.consumer({ groupId: "main-worker-2" });
  await consumer.connect();
  const producer = kafka.producer();
  await producer.connect();

  await consumer.subscribe({ topic: TOPIC_NAME, fromBeginning: true });

  await consumer.run({
    autoCommit: false,
    eachMessage: async ({ topic, partition, message }) => {
      const rawValue = message.value?.toString();
      console.log({
        partition,
        offset: message.offset,
        value: rawValue,
      });

      if (!rawValue) {
        console.warn("⚠️ Empty Kafka message, skipping...");
        await commitOffset();
        return;
      }

      let parsedValue;
      try {
        parsedValue = JSON.parse(rawValue || "{}");
      } catch (err) {
        console.warn("⚠️ Invalid JSON in message, skipping...");
        await commitOffset();
        return;
      }

      const { executionId, stage } = parsedValue;

      if (!executionId || typeof stage !== "number") {
        console.warn("⚠️ Invalid message format, skipping...");
        await commitOffset();
        return;
      }

      try {
        if (stage == 1) {
          await prisma.workflowExecution.update({
            where: { id: executionId },
            data: {
              status: WorkflowExecutionStatus.RUNNING,
              startedAt: new Date(),
              phases: {
                updateMany: {
                  where: {},
                  data: { status: ExecutionPhaseStatus.PENDING },
                },
              },
              workflow: {
                update: {
                  lastRunStatus: WorkflowExecutionStatus.RUNNING,
                  lastRunAt: new Date(),
                  lastRunId: executionId,
                },
              },
            },
          });
        }

        const executinnWithPhases = await prisma.workflowExecution.findUnique({
          where: { id: executionId },
          include: {
            phases: {
              where: { number: stage },
              include: {
                action: {
                  include: {
                    taskInfo: {
                      include: {
                        inputs: true,
                        outputs: true,
                      },
                    },
                  },
                },
                trigger: {
                  include: {
                    taskInfo: {
                      include: {
                        inputs: true,
                        outputs: true,
                      },
                    },
                  },
                },
              },
            },
            _count: {
              select: { phases: true },
            },
          },
        });

        if (!executinnWithPhases) {
          console.warn("⚠️ Phase not found, skipping...");
          await commitOffset();
          return;
        }

        const phase = executinnWithPhases.phases[0];

        if (!phase) {
          console.warn("⚠️ Phase not found, skipping...");
          await commitOffset();
          return;
        }


        const edges = JSON.parse(executinnWithPhases.definition)
          .edges as Edge[];

        const startedAt = new Date();
        const node = JSON.parse(phase.data) as AppNode;

        await prisma.executionPhase.update({
          where: { id: phase.id },
          data: {
            status: ExecutionPhaseStatus.RUNNING,
            startedAt,
          },
        });
        let executionFailed = false;
        let creditsConsumed = 0;

        creditsConsumed = node.data.credits || 0;

        // TODO
        const userBalanceUpdateResult = await prisma.userBalance.update({
          where: { userId: executinnWithPhases.userId, credits: { gte: creditsConsumed} },
          data: { credits: { decrement: creditsConsumed } },
        });

        
        const environment = getEnvironment(executionId);
        
        const logCollector = createLogCollector(phase.id);
        let success = false;
        if(!userBalanceUpdateResult) {
          logCollector.ERROR("Insufficient credits");
          executionFailed = true;
        } else {
          success = await executePhase(
            phase,
            node,
            environment,
            edges,
            logCollector
          );
        }


        console.log(success, stage);

        await prisma.executionPhase.update({
          where: { id: phase.id },
          data: {
            completedAt: new Date(),
            status: success
              ? ExecutionPhaseStatus.COMPLETED
              : ExecutionPhaseStatus.FAILED,
            workflowExecution: {
              update: {
                creditsConsumed: { increment: creditsConsumed },
              },
            },
            inputs: JSON.stringify(environment.phases[node.id].inputs),
            outputs: JSON.stringify(environment.phases[node.id].outputs),
            logs: {
              createMany: {
                data: logCollector.getAll().map((log) => {
                  return {
                    message: log.message,
                    logLevel: log.logLevel,
                    timestamp: log.timestamp,
                  };
                }),
              },
            },
          },
        });

        // TODO: Decrementing the credits for the user
        
        // .... in the end ....
        if (stage === executinnWithPhases._count.phases) {
          console.log("last stage reached, updating execution status");

          await cleanupEnvironment(executionId);

          await prisma.workflowExecution.update({
            where: { id: executionId },
            data: {
              status: executionFailed
                ? WorkflowExecutionStatus.FAILED
                : WorkflowExecutionStatus.COMPLETED,
              completedAt: new Date(),
              workflow: {
                update: {
                  lastRunStatus: executionFailed
                    ? WorkflowExecutionStatus.FAILED
                    : WorkflowExecutionStatus.COMPLETED,
                },
              },
            },
          });
        } else {
          await producer.send({
            topic,
            messages: [
              {
                key: executionId,
                value: JSON.stringify({
                  executionId,
                  stage: stage + 1,
                }),
              },
            ],
          });
        }

        await commitOffset();
      } catch (err) {
        console.log(err);
        await commitOffset();
        return;
      }

      // commitOffset helper to avoid repeating the same logic
      async function commitOffset() {
        await consumer.commitOffsets([
          {
            topic,
            partition,
            offset: (parseInt(message.offset) + 1).toString(),
          },
        ]);
      }
    },
  });
}

main();
