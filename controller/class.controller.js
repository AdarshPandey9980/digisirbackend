import mongoose from "mongoose";
import Class from "../models/class.model.js";

export const addClass = async (req, res) => {
  try {
    const { class_name, batch, subjects, institute_id } = req.body;
    const newClass = new Class({
      class_name,
      batch,
      subjects,
      institute_id,
      teachers: [],
      students: [],
      attendance: [],
      timetable: [],
    });
    await newClass.save();
    res.status(201).json(newClass);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a class
export const deleteClass = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: "Class not found" });
    }
    await Class.findByIdAndDelete(id);
    res.status(200).json({ message: "Class deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update class information
export const updateClassInfo = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const updatedClass = await Class.findByIdAndUpdate(id, updates, {
      new: true,
    });
    res.status(200).json(updatedClass);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add subject
export const addSubject = async (req, res) => {
  try {
    const { id } = req.params;
    const { subject } = req.body;
    const updatedClass = await Class.findByIdAndUpdate(
      id,
      { $addToSet: { subjects: subject } },
      { new: true }
    );
    res.status(200).json(updatedClass.subjects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add teacher
export const addTeacher = async (req, res) => {
  try {
    const { id } = req.params;
    const { teacherId } = req.body;
    const updatedClass = await Class.findByIdAndUpdate(
      id,
      { $addToSet: { teachers: teacherId } },
      { new: true }
    ).populate("teachers");
    res.status(200).json(updatedClass.teachers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add student
export const addStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { studentId } = req.body;
    const updatedClass = await Class.findByIdAndUpdate(
      id,
      { $addToSet: { students: studentId } },
      { new: true }
    ).populate("students");
    res.status(200).json(updatedClass.students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add timetable
export const addTimetable = async (req, res) => {
  try {
    const { id } = req.params;
    const timetableEntry = req.body;
    const updatedClass = await Class.findByIdAndUpdate(
      id,
      { $push: { timetable: timetableEntry } },
      { new: true }
    ).populate("timetable.teacher");
    res.status(200).json(updatedClass.timetable);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get class information
export const getUserClassInfo = async (req, res) => {
  try {
    const { userId, role } = req.query;
    let query = {};

    if (role === "student") {
      query = { students: userId };
    } else if (role === "teacher") {
      query = { teachers: userId };
    } else {
      return res.status(400).json({ message: "Invalid role specified" });
    }

    const classInfo = await Class.findOne(query)
      .populate("teachers students timetable.teacher")
      .exec();

    if (!classInfo) {
      return res.status(404).json({ message: "Class not found" });
    }

    res.status(200).json(classInfo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mark attendance
export const markAttendance = async (req, res) => {
  try {
    const { classId } = req.params;
    const { studentId, date, status } = req.body;

    // Check if student belongs to the class
    const classData = await Class.findById(classId);
    if (!classData.students.includes(studentId)) {
      return res.status(400).json({ message: "Student not in this class" });
    }

    // Remove existing attendance entry for the date
    await Class.updateOne(
      { _id: classId },
      { $pull: { attendance: { student_id: studentId, date } } }
    );

    // Add new attendance entry
    await Class.updateOne(
      { _id: classId },
      { $push: { attendance: { student_id: studentId, date, status } } }
    );

    res.status(200).json({ message: "Attendance updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get student attendance
export const getStudentAttendance = async (req, res) => {
  try {
    const { studentId } = req.params;
    const classes = await Class.find({ students: studentId })
      .populate("attendance.student_id")
      .exec();

    let attendanceRecords = [];
    classes.forEach((classData) => {
      const studentAttendance = classData.attendance.filter((entry) =>
        entry.student_id._id.equals(studentId)
      );
      attendanceRecords.push(...studentAttendance);
    });

    res.status(200).json(attendanceRecords);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getClassesByInstitute = async (req, res) => {
  try {
    const { institute_id } = req.params;
    const classes = await Class.find({ institute_id });

    // If no classes are found, you can either return an empty array or a 404.
    if (!classes || classes.length === 0) {
      return res
        .status(404)
        .json({ message: "No classes found for the given institute id" });
    }

    res.status(200).json(classes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getClassById = async (req, res) => {
  try {
    const { classId } = req.params;
    const classInfo = await Class.findById(classId);

    if (!classInfo) {
      return res.status(404).json({ message: "Class not found" });
    }

    res.status(200).json(classInfo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

