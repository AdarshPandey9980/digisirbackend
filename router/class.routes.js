// classRoutes.js
import express from "express";
import {
  addClass,
  addStudent,
  addSubject,
  addTeacher,
  addTimetable,
  deleteClass,
  getClassById,
  getClassesByInstitute,
  getUserClassInfo,
  getStudentAttendance,
  markAttendance,
  updateClassInfo,
} from "../controller/class.controller.js";

const router = express.Router();

// Class management routes
router.post("/add", addClass);
router.delete("/delete/:id", deleteClass);
router.put("/update/:id", updateClassInfo);

// Individual update routes
router.put("/:id/subjects", addSubject);
router.put("/:id/teachers", addTeacher);
router.put("/:id/students", addStudent);

// Timetable route
router.post("/:id/timetable", addTimetable);

// Class information route
router.get("/info", getUserClassInfo);

// Attendance routes
router.post("/:classId/attendance", markAttendance);
router.get("/attendance/:studentId", getStudentAttendance);

router.get("/:institute_id/institute", getClassesByInstitute);

// Route to get a single class by class id
router.get("/:classId/classes", getClassById);

export default router;
