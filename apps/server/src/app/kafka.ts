import { PubSub } from "graphql-subscriptions";
import { Kafka } from "kafkajs";

export async function startKafkaConsumer(pubsub: PubSub) {
  const kafka = new Kafka({
    clientId: "graphql-server",
    brokers: ["localhost:9092"], 
  });

  const consumer = kafka.consumer({ groupId: "graphql-consumers" });

  await consumer.connect();
  await consumer.subscribe({ topic: "run-updates", fromBeginning: false });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const run = JSON.parse(message.value?.toString() || "{}");

      pubsub.publish(`RUN_UPDATED:${run.id}`, { runUpdated: run });
    },
  });
}
