import { Router } from "express";
import mongoose from "mongoose";
import Student from "../models/Student.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

// Accepts scores as an array or as a comma-separated string from the UI.
function parseScores(input) {
  const raw = Array.isArray(input)
    ? input
    : String(input ?? "")
        .split(",")
        .filter((value) => value.trim() !== "");

  const scores = raw.map((value) => Number(value));

  if (!scores.length || scores.some((score) => !Number.isFinite(score))) {
    return null;
  }

  return scores;
}

function readPayload(body) {
  const name = body?.name?.trim();
  const section = body?.section?.trim();
  const scores = parseScores(body?.scores);

  if (!name || !section || !scores) {
    return {
      error: "Name, section, and at least one numeric score are required.",
    };
  }

  return { data: { name, section, scores } };
}

router.get("/", async (_request, response, next) => {
  try {
    const students = await Student.find().sort({ name: 1 }).lean();
    response.json(students);
  } catch (error) {
    next(error);
  }
});

router.post("/", requireAuth, async (request, response, next) => {
  try {
    const { data, error } = readPayload(request.body);

    if (error) return response.status(400).json({ message: error });

    const student = await Student.create(data);
    return response.status(201).json(student);
  } catch (error) {
    return next(error);
  }
});

router.put("/:id", requireAuth, async (request, response, next) => {
  try {
    if (!mongoose.isValidObjectId(request.params.id)) {
      return response.status(400).json({ message: "Invalid student id." });
    }

    const { data, error } = readPayload(request.body);

    if (error) return response.status(400).json({ message: error });

    const student = await Student.findByIdAndUpdate(request.params.id, data, {
      new: true,
      runValidators: true,
    });

    if (!student) {
      return response.status(404).json({ message: "Student not found." });
    }

    return response.json(student);
  } catch (error) {
    return next(error);
  }
});

router.delete("/:id", requireAuth, async (request, response, next) => {
  try {
    if (!mongoose.isValidObjectId(request.params.id)) {
      return response.status(400).json({ message: "Invalid student id." });
    }

    const student = await Student.findByIdAndDelete(request.params.id);

    if (!student) {
      return response.status(404).json({ message: "Student not found." });
    }

    return response.status(204).end();
  } catch (error) {
    return next(error);
  }
});

export default router;
