import express from "express"
import { upload } from "../middleware/multer.middleware.js";
import { registerInstituteAdmin,addMembers,getRequest,aproveRequest,loginUser } from "../controller/instituteAdmin.controller.js";

const router = express.Router()

router.route('/register').post(upload.single("avatar"),registerInstituteAdmin)
router.route('/login').post(loginUser)
router.route('/addMembers').post(addMembers)
router.route('/get-joining-request').post(getRequest)
router.route('/aprove-request').post(aproveRequest)

export default router