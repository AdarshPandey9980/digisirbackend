import express from "express";
import { upload } from "../middleware/multer.middleware.js";
import {
  register,
  loginUser,
  registerInstituteAdmin,
  userEnquire,
  getUserEnquire,
  getAllInstitue,
  getOneInstitueInfo,
  addInstitutePayment,
  getInstitutePayments,
  updatePassword,
} from "../controller/superadmin.controller.js";
const router = express.Router();

router.route("/register").post(upload.single("avatar"), register);
router.route("/login").post(loginUser);
router
  .route("/register-institute-admin")
  .post(upload.single("avatar"), registerInstituteAdmin);
router.route("/user-enquire").post(userEnquire);
router.route("/get-user-enquire").post(getUserEnquire);
router.route("/get-all-institue").post(getAllInstitue);
router.route("/get-one-institue-info").post(getOneInstitueInfo);
router.route("/get-institute-payments").post(getInstitutePayments);
router.route("/add-institute-payment").post(addInstitutePayment);
router.route("/update-password/:adminId").get(updatePassword);

export default router;
