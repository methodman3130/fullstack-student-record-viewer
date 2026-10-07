import "dotenv/config";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.js";
import studentRoutes from "./routes/students.js";

const app = express();
const port = process.env.PORT || 5000;

// Credentialed requests need an explicit origin, not the "*" wildcard.
const allowedOrigins = (process.env.CLIENT_ORIGIN ?? "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) =>
      !origin || allowedOrigins.includes(origin)
        ? callback(null, true)
        : callback(new Error(`Origin ${origin} is not allowed.`)),
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

app.get("/api/health", (_request, response) => response.json({ status: "ok" }));
app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);

app.use((_request, response) =>
  response.status(404).json({ message: "Route not found." }),
);

app.use((error, _request, response, _next) => {
  console.error(error);
  const status = error.name === "ValidationError" ? 400 : 500;
  response
    .status(status)
    .json({ message: error.message || "Unexpected server error." });
});

async function startServer() {
  const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error(
      "MONGODB_URI (or MONGO_URI) is required. Set it in server/.env.",
    );
  }

  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is required. Set it in server/.env.");
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

export default app;
