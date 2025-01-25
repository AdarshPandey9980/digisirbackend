import express from "express"
import {registerUser,verifyOpt,loginUser,resendOTP} from "../controller/login.controller.js"
import {verifyOTPJwt} from "../middleware/auth.middleware.js"

const router = express.Router()

router.route('/register').post(registerUser)
router.route('/verify').post(verifyOpt)
router.route('/login').post(loginUser)
router.route('/resendotp').post(resendOTP)

export default router