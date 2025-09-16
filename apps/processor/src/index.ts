import {Kafka} from "kafkajs";

const TOPIC_NAME = "workflow-events"

const kafka = new Kafka({
    clientId: 'processor',
    brokers: ['localhost:9092']
})

async function main() {
    const producer =  kafka.producer();
    await producer.connect();

    while(1) {
        

        await new Promise(r => setTimeout(r, 3000));
    }
}

main();