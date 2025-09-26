import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "analytic-service",
  // as set in the dockerfile
  brokers: ["localhost:9094"],
});

const consumer = kafka.consumer({ groupId: "analytic-service" });

const runConsumer = async () => {
  try {
    await consumer.connect();
    await consumer.subscribe({
      topic: "payment-successful",
      // se a conexãom for perdida, ainda vai dar fetch nas mensagens do kafka
      fromBeginning: true,
    });

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const value = message.value.toString();
        const { userId, cart } = JSON.parse(value);

        const total = cart
          .reduce((acc, item) => acc + item.price, 0)
          .toFixed(2);

        console.log(`Analytic consumer: User ${userId} paid ${total}`);
      },
    });
  } catch (err) {
    console.log(err);
  }
};

runConsumer();
