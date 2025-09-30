import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "kafka-service",
  // as set in the dockerfile
  brokers: ["localhost:9094"],
});

const admin = kafka.admin();

// If not set in the kafka-ui you can create your topics programmatically like this
const runTopicCreation = async () => {
  await admin.connect();
  await admin.createTopics({
    topics: [
      { topic: "payment-sucessful" },
      { topic: "order-successful" },
      { topic: "email-successful" },
      { topic: "order-sucessful" },
    ],
  });
};

// runTopicCreation();
