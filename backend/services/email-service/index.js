import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "email-service",
  // as set in the dockerfile
  brokers: ["localhost:9094", "localhost:9095", "localhost:9096"],
});

const consumer = kafka.consumer({ groupId: "email-service" });
const producer = kafka.producer();

const runConsumer = async () => {
  try {
    await producer.connect();
    await consumer.connect();
    await consumer.subscribe({
      topic: "order-successful",
      // se a conexão for perdida, ainda vai dar fetch nas mensagens do kafka
      fromBeginning: true,
    });

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const value = message.value.toString();
        const { userId, orderId } = JSON.parse(value);

        //TODO: Send email to the user
        const dummyEmailId = "01212123456789";
        console.log(`Email consumer: Email sent to the user id ${userId}`);

        await producer.send({
          topic: "email-successful",
          messages: [
            {
              value: JSON.stringify({ userId, emailId: dummyEmailId }),
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
