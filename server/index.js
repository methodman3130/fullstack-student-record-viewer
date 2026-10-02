import "dotenv/config";
import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import Student from "./models/Student.js";

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/api/students", async (_request, response, next) => {
  try {
    const students = await Student.find().sort({ name: 1 }).lean();
    response.json(students);
  } catch (error) {
    next(error);
  }
});

app.use((error, _request, response, _next) => {
  console.error(error);
  response.status(500).json({ message: "Unable to retrieve student records." });
});

async function startServer() {
  const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error(
      "MONGODB_URI (or MONGO_URI) is required. Set it in server/.env.",
    );
  }

  await mongoose.connect(mongoUri);
  app.listen(port, () =>
    console.log(`Student API is listening on http://localhost:${port}`),
  );
}

startServer().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
