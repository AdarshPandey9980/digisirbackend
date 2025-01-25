import {
  AsyncHandler,
  sendOtp,
  generateTokenforUser,
} from "../utils/index.utils.js";
import bcrytp from "bcryptjs";
import instituteAdminSchema from "../models/instituteadmin.model.js";
import paymentModel from "../models/payment.model.js";
import uploadOnCloud from "../utils/cloudnary.utils.js";
import fs from "fs";

const registerInstituteAdmin = AsyncHandler(async (req, res) => {
    try {
        const {email} = req.body
        const findPaymentDetail = await paymentModel.findOne({email})
        if (!findPaymentDetail) {
            return res.status(300).json({message:"payment not found for this user"})
        }

        const userExists = await instituteAdminSchema.findOne({email})
        if (userExists) {
            return res.status(300).json({message:"user already exist"})
        }

        const {institute_name,address,password,contact_number,aadharCardNumber} = req.body

        if (!institute_name || !address || !password || !contact_number || !aadharCardNumber) {
            return res.status(400).json({message:"all field are required"})
        }

        const salt = await bcrytp.genSalt(10);
        const hashedPassword = await bcrytp.hash(password, salt);
        const hashedAadharCardNumber = await bcrytp.hash(aadharCardNumber, salt);

        const avatarLocalPath = await req.file?.path;

        if (!avatarLocalPath) throw new Error("avatar not found");
  
        const avatar = await uploadOnCloud(avatarLocalPath);
  
        if (!avatar) throw new Error("something went wrong");

        const user = await instituteAdminSchema.create({
            institute_name,
            address,
            password: hashedPassword,
            contact_number,
            aadharCardNumber: hashedAadharCardNumber,
            avatar: avatar.url,
            email
        })

        const studentKey = `student_${institute_name}_${user._id}`
        const teackerKey = `teacher_${institute_name}_${user._id}`
        const parentKey = `parent_${institute_name}_${user._id}`

        const ack = await instituteAdminSchema.findByIdAndUpdate(user._id,{$set:{joinign_key:[{key_name:"studentKey",key_value:studentKey},{key_name:"teackerKey",key_value:teackerKey},{key_name:"parentKey",key_value:parentKey}],}})

        await paymentModel.findOneAndUpdate({email},{$set:{instituteAdmin:user._id}})

        fs.unlinkSync(avatarLocalPath);

        return res.status(200).json({ack,message:"user created successfully"})


        // const userExists = await instituteAdminSchema.findOne({email})
    } catch (error) {
        fs.unlinkSync(avatarLocalPath);
        return res.status(500).json({ message: error.message });
       
    }
})

export {registerInstituteAdmin}