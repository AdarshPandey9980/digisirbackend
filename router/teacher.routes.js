import express from "express"
import {registerStudent,loginUser,joinInstitute,getAllTeachers,getTeacherLectures} from "../controller/teacher.controller.js"
import { upload } from "../middleware/multer.middleware.js";

const router = express.Router()

router.route("/register").post(upload.single("avatar"),registerStudent)
router.route("/login").post(loginUser)
router.route("/join-institute").post(joinInstitute)
router.route("/get-all-teachers").post(getAllTeachers)
router.route("/get-teacher-lectures/:teacherId").get(getTeacherLectures)

export default router