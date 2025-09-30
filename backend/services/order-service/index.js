import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "order-service",
  // as set in the dockerfile
  brokers: ["localhost:9094", "localhost:9095", "localhost:9096"],
});

const consumer = kafka.consumer({ groupId: "order-service" });
const producer = kafka.producer();

const runConsumer = async () => {
  try {
    await producer.connect();
    await consumer.connect();
    await consumer.subscribe({
      topic: "payment-successful",
      // se a conexão for perdida, ainda vai dar fetch nas mensagens do kafka
      fromBeginning: true,
    });

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const value = message.value.toString();
        const { userId, cart } = JSON.parse(value);

        //TODO: Create order on DB
        const dummyOrderId = "123456789";
        console.log(`Oder consumer: Order created for user id: ${userId}`);

        await producer.send({
          topic: "order-successful",
          messages: [
            {
              value: JSON.stringify({ userId, orderId: dummyOrderId }),
            },
          ],
        });
      },
    });
  } catch (err) {
    console.log(err);
  }
};

runConsumer();
