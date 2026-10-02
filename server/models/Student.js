import mongoose from 'mongoose'

const studentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    section: { type: String, required: true, trim: true },
    scores: {
      type: [Number],
      required: true,
      validate: [(scores) => scores.length > 0, 'At least one score is required'],
    },
  },
  { timestamps: true },
)

export default mongoose.model('Student', studentSchema)
