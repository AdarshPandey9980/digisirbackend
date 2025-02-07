// models/Class.js
import mongoose from "mongoose";
const { Schema } = mongoose;

const classSchema = new Schema({
  class_name: { type: String, required: true },
  batch: { type: String },
  subjects: [{ type: String }],
  teachers: [{ type: Schema.Types.ObjectId, ref: "Teacher" }],
  students: [{ type: Schema.Types.ObjectId, ref: "Student" }],
  attendance: [
    {
      student_id: { type: Schema.Types.ObjectId, ref: "Student" },
      date: Date,
      status: { type: String, enum: ["present", "absent"], default: "absent" },
    },
  ],
  timetable: [
    {
      day: String,
      period: String,
      subject: String,
      teacher: { type: Schema.Types.ObjectId, ref: "Teacher" },
    },
  ],
  // Reference to InstituteAdmin model
  institute_id: {
    type: Schema.Types.ObjectId,
    ref: "InstituteAdmin",
    required: true,
  },
});

export default mongoose.model("Class", classSchema);
