import express from "express"
import { upload } from "../middleware/multer.middleware.js";
import {register,loginUser,registerInstituteAdmin,addInstitutePayment,addPiticash,getAllInstitue,getInstitutePayments,getOneInstitueInfo,getPiticash,getUserEnquire,userEnquire} from "../controller/superadmin.controller.js"
import {sendOtpToEmail,verifyOtp} from "../middleware/verifyOtp.middleware.js"
const router = express.Router()

router.route('/register').post(upload.single("avatar"),register)
router.route('/login').post(loginUser)
router.route('/register-institute-admin').post(upload.single("avatar"),registerInstituteAdmin)
router.route('/sendOtp').post(sendOtpToEmail)
router.route('/verifyOtp').post(verifyOtp)
router.route('/user-enquire').post(userEnquire)
router.route('/get-user-enquire').post(getUserEnquire)
router.route('/get-all-institue').post(getAllInstitue)
router.route('/get-one-institue-info').post(getOneInstitueInfo)
router.route('/get-institute-payments').post(getInstitutePayments)
router.route('/add-institute-payment').post(addInstitutePayment)
router.route('/add-piticash').post(addPiticash)
router.route('/get-piticash').post(getPiticash)

export default router