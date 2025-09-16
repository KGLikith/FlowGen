import { Kafka } from "kafkajs";

const kafka = new Kafka({
    clientId: "graphql-server",
    brokers: ["localhost:9092"], // adjust to your setup
  });