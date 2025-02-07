import express from "express";
import {
  registerTeacher,
  loginUser,
  joinInstitute,
  getTeachersDetail,
  updatePassword,
  updateSubjects,
} from "../controller/teacher.controller.js";
import { upload } from "../middleware/multer.middleware.js";

const router = express.Router();

router.route("/register").post(upload.single("avatar"), registerTeacher);
router.route("/login").post(loginUser);
router.route("/join-institute").post(joinInstitute);
router.route("/get-all-teachers/:id").post(getTeachersDetail);
router.patch("/update/subjects/:id", updateSubjects);
router.post("/update/:teacherId", updatePassword);

export default router;
