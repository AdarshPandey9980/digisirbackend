import express from "express"
import {registerStudent,loginUser,joinInstitute,getAllStudents,getStudentLectures,checkApprovalStatus,getInstituteDetails,updateClassDetail,
    updateAttendance,
    updatePerformanceTests,
    updateProgressReports,
    updateEnrollment,
    updateNotes,
    updateTestHistory,
    updateInstituteHistory,
    updateRemarks,} from "../controller/student.controller.js"
import { upload } from "../middleware/multer.middleware.js";

const router = express.Router()

router.route("/register").post(upload.single("avatar"),registerStudent)
router.route("/login").post(loginUser)
router.route("/join-institute").post(joinInstitute)
router.route("/get-all-students").post(getAllStudents)
router.route("/get-student-lectures/:studentId").get(getStudentLectures)
router.get('/join-status/:userId', checkApprovalStatus);
router.get('/getInfo/:instituteId', getInstituteDetails);

router.patch('/update/:studentId/class-detail', updateClassDetail);
router.patch('/update/:studentId/attendance', updateAttendance);
router.patch('/update/:studentId/performance-tests', updatePerformanceTests);
router.patch('/update/:studentId/progress-reports', updateProgressReports);
router.patch('/update/:studentId/enrollment', updateEnrollment);
router.patch('/update/:studentId/notes', updateNotes);
router.patch('/update/:studentId/test-history', updateTestHistory);
router.patch('/update/:studentId/institute-history', updateInstituteHistory);
router.patch('/update/:studentId/remarks', updateRemarks);

export default router