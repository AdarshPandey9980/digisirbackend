import express from "express";

import {
  sendOtpToEmail,
  verifyOtp,
} from "../middleware/verifyOtp.middleware.js";

const router = express.Router();

router.route("/sendOtp").post(sendOtpToEmail);
router.route("/verifyOtp").post(verifyOtp);

export default router;
