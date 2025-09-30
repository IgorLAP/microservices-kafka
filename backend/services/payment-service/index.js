import express from "express";
import cors from "cors";
import { Kafka } from "kafkajs";

const PORT = 8000;
const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    optionsSuccessStatus: 200,
  })
);
app.use(express.json());

const kafka = new Kafka({
  clientId: "payment-service",
  // as set in the dockerfile
  brokers: ["localhost:9094", "localhost:9095", "localhost:9096"],
});

const producer = kafka.producer();

const connectToKafka = async () => {
  try {
    await producer.connect();
    console.log("Producer connected");
  } catch (err) {
    console.log("Error connection to Kafka", err);
  }
};

app.post("/payment-service", async (req, res) => {
  const { cart } = req.body;
  // USER COOKIE / USER ID
  const userId = "123";

  //TODO: Payment
  console.log("API alive");

  // KAFKA
  await producer.send({
    topic: "payment-successful",
    messages: [{ value: JSON.stringify({ userId, cart }) }],
  });

  return res.status(200).send("Payment successful");
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).send(err.message);
});

app.listen(PORT, () => {
  connectToKafka();
  console.log(`Payment service is running on PORT: ${PORT}`);
});
