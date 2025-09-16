require("dotenv").config();

import { PrismaClient } from "@prisma/client";
import { JsonObject } from "@prisma/client/runtime/library";
import { Kafka } from "kafkajs";

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
        parsedValue = JSON.parse(rawValue);
      } catch (err) {
        console.warn("⚠️ Invalid JSON in message, skipping...");
        await commitOffset();
        return;
      }

      

      await commitOffset();

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
