import express from "express"
import {registerUser,verifyOpt,loginUser,resendOTP,getCurrentUser,changeUserPassword} from "../controller/login.controller.js"
import {verifyJwt} from "../middleware/auth.middleware.js"

const router = express.Router()

router.route('/register').post(registerUser)
router.route('/verify').post(verifyOpt)
router.route('/login').post(loginUser)
router.route('/resendotp').post(resendOTP)
router.route('/getCurrentUser').get(verifyJwt,getCurrentUser)
router.route('/changePassword').post(verifyJwt,changeUserPassword)

export default router