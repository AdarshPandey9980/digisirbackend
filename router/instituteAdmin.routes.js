import express from "express"
import { upload } from "../middleware/multer.middleware.js";
import { registerInstituteAdmin,getMemberBykey,getRequest,aproveStudentRequest,loginUser,aproveParentRequest,aproveTeacherRequest } from "../controller/instituteAdmin.controller.js";

const router = express.Router()

router.route('/register').post(upload.single("avatar"),registerInstituteAdmin)
router.route('/login').post(loginUser)
router.route('/get-member-by-key').post(getMemberBykey)
router.route('/get-joining-request').post(getRequest)
router.route('/aprove-student-request').post(aproveStudentRequest)
router.route('/aprove-teacher-request').post(aproveTeacherRequest)
router.route('/aprove-parent-request').post(aproveParentRequest)

export default router