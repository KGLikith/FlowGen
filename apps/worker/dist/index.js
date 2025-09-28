"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const kafkajs_1 = require("kafkajs");
const db_1 = require("@automation/db");
const executePhase_1 = require("./executePhase");
const executionEnvironment_1 = require("./executionEnvironment");
const log_1 = require("./log");
const TOPIC_NAME = "workflow-events";
const kafka = new kafkajs_1.Kafka({
    clientId: "worker",
    brokers: ["localhost:9092"],
});
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const consumer = kafka.consumer({ groupId: "main-worker-2" });
        yield consumer.connect();
        const producer = kafka.producer();
        yield producer.connect();
        yield consumer.subscribe({ topic: TOPIC_NAME, fromBeginning: true });
        yield consumer.run({
            autoCommit: false,
            eachMessage: (_a) => __awaiter(this, [_a], void 0, function* ({ topic, partition, message }) {
                var _b;
                const rawValue = (_b = message.value) === null || _b === void 0 ? void 0 : _b.toString();
                console.log({
                    partition,
                    offset: message.offset,
                    value: rawValue,
                });
                if (!rawValue) {
                    console.warn("⚠️ Empty Kafka message, skipping...");
                    yield commitOffset();
                    return;
                }
                let parsedValue;
                try {
                    parsedValue = JSON.parse(rawValue || "{}");
                }
                catch (err) {
                    console.warn("⚠️ Invalid JSON in message, skipping...");
                    yield commitOffset();
                    return;
                }
                const { executionId, stage } = parsedValue;
                if (!executionId || typeof stage !== "number") {
                    console.warn("⚠️ Invalid message format, skipping...");
                    yield commitOffset();
                    return;
                }
                try {
                    if (stage == 1) {
                        yield db_1.prisma.workflowExecution.update({
                            where: { id: executionId },
                            data: {
                                status: db_1.WorkflowExecutionStatus.RUNNING,
                                startedAt: new Date(),
                                phases: {
                                    updateMany: {
                                        where: {},
                                        data: { status: db_1.ExecutionPhaseStatus.PENDING },
                                    },
                                },
                                workflow: {
                                    update: {
                                        lastRunStatus: db_1.WorkflowExecutionStatus.RUNNING,
                                        lastRunAt: new Date(),
                                        lastRunId: executionId,
                                    },
                                },
                            },
                        });
                    }
                    const executinnWithPhases = yield db_1.prisma.workflowExecution.findUnique({
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
                        yield commitOffset();
                        return;
                    }
                    const phase = executinnWithPhases.phases[0];
                    if (!phase) {
                        console.warn("⚠️ Phase not found, skipping...");
                        yield commitOffset();
                        return;
                    }
                    const edges = JSON.parse(executinnWithPhases.definition)
                        .edges;
                    const startedAt = new Date();
                    const node = JSON.parse(phase.data);
                    yield db_1.prisma.executionPhase.update({
                        where: { id: phase.id },
                        data: {
                            status: db_1.ExecutionPhaseStatus.RUNNING,
                            startedAt,
                        },
                    });
                    let executionFailed = false;
                    let creditsConsumed = 0;
                    creditsConsumed = node.data.credits || 0;
                    // TODO
                    const userBalanceUpdateResult = yield db_1.prisma.userBalance.update({
                        where: { userId: executinnWithPhases.userId, credits: { gte: creditsConsumed } },
                        data: { credits: { decrement: creditsConsumed } },
                    });
                    const environment = (0, executionEnvironment_1.getEnvironment)(executionId);
                    const logCollector = (0, log_1.createLogCollector)(phase.id);
                    let success = false;
                    if (!userBalanceUpdateResult) {
                        logCollector.ERROR("Insufficient credits");
                        executionFailed = true;
                    }
                    else {
                        success = yield (0, executePhase_1.executePhase)(phase, node, environment, edges, logCollector);
                    }
                    console.log(success, stage);
                    yield db_1.prisma.executionPhase.update({
                        where: { id: phase.id },
                        data: {
                            completedAt: new Date(),
                            status: success
                                ? db_1.ExecutionPhaseStatus.COMPLETED
                                : db_1.ExecutionPhaseStatus.FAILED,
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
                        yield (0, executionEnvironment_1.cleanupEnvironment)(executionId);
                        yield db_1.prisma.workflowExecution.update({
                            where: { id: executionId },
                            data: {
                                status: executionFailed
                                    ? db_1.WorkflowExecutionStatus.FAILED
                                    : db_1.WorkflowExecutionStatus.COMPLETED,
                                completedAt: new Date(),
                                workflow: {
                                    update: {
                                        lastRunStatus: executionFailed
                                            ? db_1.WorkflowExecutionStatus.FAILED
                                            : db_1.WorkflowExecutionStatus.COMPLETED,
                                    },
                                },
                            },
                        });
                    }
                    else {
                        yield producer.send({
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
                    yield commitOffset();
                }
                catch (err) {
                    console.log(err);
                    yield commitOffset();
                    return;
                }
                // commitOffset helper to avoid repeating the same logic
                function commitOffset() {
                    return __awaiter(this, void 0, void 0, function* () {
                        yield consumer.commitOffsets([
                            {
                                topic,
                                partition,
                                offset: (parseInt(message.offset) + 1).toString(),
                            },
                        ]);
                    });
                }
            }),
        });
    });
}
main();
