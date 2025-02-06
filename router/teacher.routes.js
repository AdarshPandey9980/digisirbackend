import express from "express";
import {
  registerStudent,
  loginUser,
  joinInstitute,
  getAllTeachers,
  getTeacherLectures,

  updateSubjects,
    updateClasses,
    updateAttendance,
    updateNotices,
    updatePerformanceReports,
    generateTestPaper
} from "../controller/teacher.controller.js";
import { upload } from "../middleware/multer.middleware.js";

const router = express.Router();

router.route("/register").post(upload.single("avatar"), registerStudent);
router.route("/login").post(loginUser);
router.route("/join-institute").post(joinInstitute);
router.route("/get-all-teachers").post(getAllTeachers);
router.route("/get-teacher-lectures/:teacherId").get(getTeacherLectures);

router.patch('/update/:teacherId/subjects', updateSubjects);
router.patch('/update/:teacherId/classes', updateClasses);
router.patch('/update/:teacherId/attendance', updateAttendance);
router.patch('/update/:teacherId/notices', updateNotices);
router.patch('/update/:teacherId/performance_reports', updatePerformanceReports);
router.post('/update/:teacherId/generate_test_paper', generateTestPaper);

export default router;
