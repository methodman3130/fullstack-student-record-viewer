import "dotenv/config";
import mongoose from "mongoose";
import Student from "./models/Student.js";

const starterStudents = [
  { name: "Ana Santos", section: "A", scores: [90, 88, 95] },
  { name: "Ben Cruz", section: "A", scores: [70, 74, 72] },
  { name: "Carlo Reyes", section: "B", scores: [85, 89, 92] },
  { name: "Dina Garcia", section: "B", scores: [78, 81, 80] },
];

async function seedDatabase() {
  const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error(
      "MONGODB_URI (or MONGO_URI) is required. Set it in server/.env.",
    );
  }

  await mongoose.connect(mongoUri);
  await Student.deleteMany({});
  await Student.insertMany(starterStudents);
  console.log("Seeded four student records.");
  await mongoose.disconnect();
}

seedDatabase().catch(async (error) => {
  console.error(error.message);
  await mongoose.disconnect();
  process.exit(1);
});
