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
                    parsedValue = JSON.parse(rawValue);
                }
                catch (err) {
                    console.warn("⚠️ Invalid JSON in message, skipping...");
                    yield commitOffset();
                    return;
                }
                yield commitOffset();
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
