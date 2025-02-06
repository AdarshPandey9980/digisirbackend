const express = require("express");
const mongoose = require("mongoose");
const Class = require("../models/Class"); // Import Class model
const router = express.Router();

// ✅ 1. Mark Attendance for a Class
router.post("/:classId/attendance", async (req, res) => {
  try {
    const { classId } = req.params;
    const { teacherId, batch, students } = req.body; // students -> [{ studentId, status }]

    const classData = await Class.findById(classId);
    if (!classData) return res.status(404).json({ error: "Class not found" });

    const attendanceRecord = {
      date: new Date(),
      batch,
      teacher: teacherId,
      attendance: students
    };

    classData.attendanceRecords.push(attendanceRecord);
    await classData.save();

    res.status(200).json({ message: "Attendance recorded successfully", attendance: attendanceRecord });
  } catch (error) {
    res.status(500).json({ error: "Internal server error", details: error.message });
  }
});

// ✅ 2. Get Attendance for a Student (For Dashboard Visualization)
router.get("/student/:studentId", async (req, res) => {
  try {
    const { studentId } = req.params;

    // Find all classes where this student has attendance records
    const classes = await Class.find({ "attendanceRecords.attendance.student": studentId });

    let totalPresent = 0;
    let totalAbsent = 0;
    let attendanceData = [];

    classes.forEach(classData => {
      classData.attendanceRecords.forEach(record => {
        const studentAttendance = record.attendance.find(att => att.student.toString() === studentId);
        if (studentAttendance) {
          attendanceData.push({ date: record.date, status: studentAttendance.status });
          if (studentAttendance.status === "Present") totalPresent++;
          else totalAbsent++;
        }
      });
    });

    res.status(200).json({
      totalPresent,
      totalAbsent,
      attendanceData
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error", details: error.message });
  }
});

module.exports = router;
