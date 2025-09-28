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
const kafkajs_1 = require("kafkajs");
const db_1 = require("@automation/db");
const TOPIC_NAME = "workflow-events";
const kafka = new kafkajs_1.Kafka({
    clientId: "processor",
    brokers: ["localhost:9092"],
});
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const producer = kafka.producer();
        yield producer.connect();
        try {
            while (true) {
                const outbox = yield db_1.prisma.executionOutbox.findMany({
                    where: {},
                    take: 10,
                });
                if (outbox.length === 0) {
                    // nothing to process, wait a bit
                    yield new Promise((r) => setTimeout(r, 3000));
                    continue;
                }
                console.log("📦 Pending rows", outbox.length);
                yield producer.send({
                    topic: TOPIC_NAME,
                    messages: outbox.map((ex) => ({
                        key: ex.id.toString(),
                        value: JSON.stringify({
                            executionId: ex.workflowExecId,
                            stage: 1,
                        }),
                    })),
                });
                yield db_1.prisma.executionOutbox.deleteMany({
                    where: {
                        id: {
                            in: outbox.map((o) => o.id),
                        },
                    },
                });
            }
        }
        catch (err) {
            console.error("❌ Error in producer loop:", err);
        }
        finally {
            // ✅ flush pending messages before shutdown
            yield producer.disconnect();
        }
    });
}
main();
