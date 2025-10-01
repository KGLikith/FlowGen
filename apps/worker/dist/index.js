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
const executePhase_1 = require("./execution/executePhase");
const executionEnvironment_1 = require("./execution/executionEnvironment");
const log_1 = require("./log");
const updateWorkflowExecution_1 = require("./actions/updateWorkflowExecution");
const getExecutionDetails_1 = require("./actions/getExecutionDetails");
const updateExecutionPhase_1 = require("./actions/updateExecutionPhase");
const updateUserBalance_1 = require("./actions/updateUserBalance");
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
                var _b, _c, _d;
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
                        yield (0, updateWorkflowExecution_1.updateWorkflowExecution)(executionId, {
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
                        });
                    }
                    const executionWithPhases = yield (0, getExecutionDetails_1.getExecutionDetails)(executionId, stage);
                    if (!executionWithPhases) {
                        console.warn("⚠️ Phase not found, skipping...");
                        yield commitOffset();
                        return;
                    }
                    const phase = executionWithPhases.phases[0];
                    if (!phase) {
                        console.warn("⚠️ Phase not found, skipping...");
                        yield commitOffset();
                        return;
                    }
                    const edges = JSON.parse(executionWithPhases.definition)
                        .edges;
                    const startedAt = new Date();
                    const node = JSON.parse(phase.data);
                    yield (0, updateExecutionPhase_1.updateExecutionPhase)(phase.id, {
                        status: db_1.ExecutionPhaseStatus.RUNNING,
                        startedAt,
                    });
                    let creditsConsumed = 0;
                    creditsConsumed = node.data.credits || 0;
                    // TODO
                    const userBalanceUpdateResult = yield (0, updateUserBalance_1.decrementUserBalance)(executionWithPhases.userId, creditsConsumed);
                    const environment = (0, executionEnvironment_1.getEnvironment)(executionId);
                    const logCollector = (0, log_1.createLogCollector)();
                    let success = false;
                    if (!userBalanceUpdateResult.success) {
                        logCollector.ERROR(userBalanceUpdateResult.error || "Insufficient credit balance");
                        success = true;
                    }
                    else {
                        success = yield (0, executePhase_1.executePhase)(phase, node, environment, edges, logCollector);
                    }
                    yield (0, updateExecutionPhase_1.updateExecutionPhase)(phase.id, {
                        completedAt: new Date(),
                        status: success
                            ? db_1.ExecutionPhaseStatus.COMPLETED
                            : db_1.ExecutionPhaseStatus.FAILED,
                        inputs: JSON.stringify((_c = environment.phases[node.id]) === null || _c === void 0 ? void 0 : _c.inputs),
                        outputs: JSON.stringify((_d = environment.phases[node.id]) === null || _d === void 0 ? void 0 : _d.outputs),
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
                        yield (0, executionEnvironment_1.cleanupEnvironment)(executionId);
                        yield (0, updateWorkflowExecution_1.updateWorkflowExecution)(executionId, {
                            status: success
                                ? db_1.WorkflowExecutionStatus.FAILED
                                : db_1.WorkflowExecutionStatus.COMPLETED,
                            completedAt: new Date(),
                            workflow: {
                                update: {
                                    lastRunStatus: success
                                        ? db_1.WorkflowExecutionStatus.FAILED
                                        : db_1.WorkflowExecutionStatus.COMPLETED,
                                },
                            },
                        });
                    }
                    else {
                        if (!userBalanceUpdateResult.success) {
                            yield (0, updateWorkflowExecution_1.updateWorkflowExecution)(executionId, {
                                status: db_1.WorkflowExecutionStatus.FAILED,
                                completedAt: new Date(),
                                workflow: {
                                    update: {
                                        lastRunStatus: db_1.WorkflowExecutionStatus.FAILED,
                                    },
                                },
                                phases: {
                                    updateMany: {
                                        where: { status: db_1.ExecutionPhaseStatus.PENDING },
                                        data: {
                                            status: db_1.ExecutionPhaseStatus.CANCELLED,
                                        },
                                    },
                                },
                            });
                            yield (0, updateExecutionPhase_1.updatePendingExecutionPhases)(executionId, {
                                completedAt: new Date(),
                                status: db_1.ExecutionPhaseStatus.CANCELLED,
                            }, {
                                logLevel: "ERROR",
                                message: userBalanceUpdateResult.error ||
                                    "Insufficient credit balance",
                                timestamp: new Date(),
                            });
                            yield (0, executionEnvironment_1.cleanupEnvironment)(executionId);
                            yield commitOffset();
                            return;
                        }
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
