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
import { executePhase } from "./execution/executePhase";
import {
  cleanupEnvironment,
  getEnvironment,
} from "./execution/executionEnvironment";
import { Edge } from "./schema/types";
import { AppNode } from "./schema/appnode";
import { createLogCollector } from "./log";
import { updateWorkflowExecution } from "./actions/updateWorkflowExecution";
import { getExecutionDetails } from "./actions/getExecutionDetails";
import {
  updateExecutionPhase,
  updatePendingExecutionPhases,
} from "./actions/updateExecutionPhase";
import { decrementUserBalance } from "./actions/updateUserBalance";

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
          await updateWorkflowExecution(executionId, {
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
          });
        }

        const executionWithPhases = await getExecutionDetails(
          executionId,
          stage
        );

        if (!executionWithPhases) {
          console.warn("⚠️ Phase not found, skipping...");
          await commitOffset();
          return;
        }

        const phase = executionWithPhases.phases[0];

        if (!phase) {
          console.warn("⚠️ Phase not found, skipping...");
          await commitOffset();
          return;
        }

        const edges = JSON.parse(executionWithPhases.definition)
          .edges as Edge[];

        const startedAt = new Date();
        const node = JSON.parse(phase.data) as AppNode;

        await updateExecutionPhase(phase.id, {
          status: ExecutionPhaseStatus.RUNNING,
          startedAt,
        });

        let creditsConsumed = 0;

        creditsConsumed = node.data.credits || 0;

        // TODO
        const userBalanceUpdateResult = await decrementUserBalance(
          executionWithPhases.userId,
          creditsConsumed
        );

        const environment = getEnvironment(executionId);

        const logCollector = createLogCollector();

        let success = false;

        if (!userBalanceUpdateResult.success) {
          logCollector.ERROR(
            userBalanceUpdateResult.error || "Insufficient credit balance"
          );
          success = false;
        } else {
          success = await executePhase(
            phase,
            node,
            environment,
            edges,
            logCollector
          );
        }

        await updateExecutionPhase(phase.id, {
          completedAt: new Date(),
          status: success
            ? ExecutionPhaseStatus.COMPLETED
            : ExecutionPhaseStatus.FAILED,
          inputs: JSON.stringify(environment.phases[node.id]?.inputs),
          outputs: JSON.stringify(environment.phases[node.id]?.outputs),
          workflowExecution: {
            update: {
              creditsConsumed: { increment: creditsConsumed },
            },
          },
          logs: {
            createMany: {
              data: logCollector.getAll(),
            },
          },
        });

        if (stage === executionWithPhases._count.phases) {

          await cleanupEnvironment(executionId);

          await updateWorkflowExecution(executionId, {
            status: success
              ? WorkflowExecutionStatus.COMPLETED
              : WorkflowExecutionStatus.FAILED,
            completedAt: new Date(),
            workflow: {
              update: {
                lastRunStatus: success
                  ? WorkflowExecutionStatus.FAILED
                  : WorkflowExecutionStatus.COMPLETED,
              },
            },
          });
        } else {
          if (!userBalanceUpdateResult.success) {
            await updateWorkflowExecution(executionId, {
              status: WorkflowExecutionStatus.FAILED,
              completedAt: new Date(),
              workflow: {
                update: {
                  lastRunStatus: WorkflowExecutionStatus.FAILED,
                },
              },
              phases: {
                updateMany: {
                  where: { status: ExecutionPhaseStatus.PENDING },
                  data: {
                    status: ExecutionPhaseStatus.CANCELLED,
                  },
                },
              },
            });

            await updatePendingExecutionPhases(
              executionId,
              {
                completedAt: new Date(),
                status: ExecutionPhaseStatus.CANCELLED,
              },
              {
                logLevel: "ERROR",
                message:
                  userBalanceUpdateResult.error ||
                  "Insufficient credit balance",
                timestamp: new Date(),
              }
            );

            await cleanupEnvironment(executionId);
            await commitOffset();
            return;
          }

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
