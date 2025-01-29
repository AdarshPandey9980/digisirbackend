import express from "express"
import { upload } from "../middleware/multer.middleware.js";
import { registerInstituteAdmin,getMemberBykey,getRequest,aproveStudentRequest,loginUser,aproveParentRequest,aproveTeacherRequest,addLectureSchedule,} from "../controller/instituteAdmin.controller.js";
import cors from "cors"

const router = express.Router()
router.use(cors({
    origin:"*",
    // origin: 'http://localhost:5174', // Vite's default dev server // Allowed methods
    credentials: true,              // Allow cookies
}));

router.route('/register').post(upload.single("avatar"),registerInstituteAdmin)
router.route('/login').post(loginUser)
router.route('/get-member-by-key').post(getMemberBykey)
router.route('/get-joining-request').post(getRequest)
router.route('/aprove-student-request').post(aproveStudentRequest)
router.route('/aprove-teacher-request').post(aproveTeacherRequest)
router.route('/aprove-parent-request').post(aproveParentRequest)
router.route("/add-lecture-schedule").post(addLectureSchedule)
// router.route("/add-student-info").post(updateStudentInfo)

export default router