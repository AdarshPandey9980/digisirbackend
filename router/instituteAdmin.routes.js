import express from "express"
import { upload } from "../middleware/multer.middleware.js";
import { registerInstituteAdmin } from "../controller/instituteAdmin.controller.js";

const router = express.Router()

router.route('/register').post(upload.single("avatar"),registerInstituteAdmin)


export default router