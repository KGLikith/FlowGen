import { Kafka } from "kafkajs";
import { prisma } from "@automation/db";

const TOPIC_NAME = "workflow-events";

const kafka = new Kafka({
  clientId: "processor",
  brokers: ["localhost:9092"],
});

async function main() {
  const producer = kafka.producer();
  await producer.connect();

  try {
    while (true) {
      const outbox = await prisma.executionOutbox.findMany({
        where: {},
        take: 10,
      });

      if (outbox.length === 0) {
        // nothing to process, wait a bit
        await new Promise((r) => setTimeout(r, 3000));
        continue;
      }

      console.log("📦 Pending rows", outbox.length);

      await producer.send({
        topic: TOPIC_NAME,
        messages: outbox.map((ex) => ({
          key: ex.id.toString(), 
          value: JSON.stringify({
            executionId: ex.workflowExecId,
            stage: 1,
          }),
        })),
      });

      await prisma.executionOutbox.deleteMany({
        where: {
          id: {
            in: outbox.map((o) => o.id),
          },
        },
      });
    }
  } catch (err) {
    console.error("❌ Error in producer loop:", err);
  } finally {
    // ✅ flush pending messages before shutdown
    await producer.disconnect();
  }
}

main();
