const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  status: { type: String, enum: ["Present", "Absent"], required: true }
});

const classSchema = new mongoose.Schema({
  className: { type: String, required: true },
  batch: { type: String, required: true },
  subjects: [{ type: String, required: true }],
  teachers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Teacher" }],
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
  notifications: [{
    message: { type: String, required: true },
    date: { type: Date, default: Date.now }
  }],
  timetable: {
    type: Map,
    of: [{
      subject: { type: String, required: true },
      teacher: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher" },
      day: { type: String, required: true },
      startTime: { type: String, required: true },
      endTime: { type: String, required: true }
    }],
    default: {}
  },
  attendanceRecords: [{
    date: { type: Date, required: true },
    batch: { type: String, required: true },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher", required: true },
    attendance: [attendanceSchema]
  }]
}, { timestamps: true });

module.exports = mongoose.model("Class", classSchema);
