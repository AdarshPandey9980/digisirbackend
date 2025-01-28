import express from "express"
import {registerStudent,loginUser,joinInstitute,getAllStudents,getStudentLectures,checkApprovalStatus,getInstituteDetails} from "../controller/student.controller.js"
import { upload } from "../middleware/multer.middleware.js";

const router = express.Router()

router.route("/register").post(upload.single("avatar"),registerStudent)
router.route("/login").post(loginUser)
router.route("/join-institute").post(joinInstitute)
router.route("/get-all-students").post(getAllStudents)
router.route("/get-student-lectures/:studentId").get(getStudentLectures)
router.get('/join-status/:userId', checkApprovalStatus);
router.get('/getInfo/:instituteId', getInstituteDetails);

export default router