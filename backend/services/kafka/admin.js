import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "kafka-service",
  // as set in the dockerfile
  brokers: ["localhost:9094"],
});

const admin = kafka.admin();

const runTopicCreation = async () => {
  await admin.connect();
  await admin.createTopics({
    topics: [{ topic: "payment-sucessful" }, { topic: "order-successful" }],
  });
};

runTopicCreation();
