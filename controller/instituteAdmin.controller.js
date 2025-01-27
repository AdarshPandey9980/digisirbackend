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
import {generatePaymentPDF} from "../utils/generatePdf.utils.js"
import {sendAck} from "../utils/resentEmailService.utils.js"
import parentModel from "../models/parent.model.js";
import studentModel from "../models/student.model.js";
import teacherModel from "../models/teacher.model.js";

const registerInstituteAdmin = AsyncHandler(async (req, res) => {
    try {
        const {email} = req.body
        const findPaymentDetail = await paymentModel.findOne({email})
        if (!findPaymentDetail && !findPaymentDetail?.signature) {
            return res.status(300).json({message:"payment not found for this user"})
        }

        const userExists = await instituteAdminSchema.findOne({email})
        const studentExist = await studentModel.findOne({email})
        const teacherExist = await teacherModel.findOne({email})
        const parentExist = await parentModel.findOne({email})
        if (userExists || studentExist || teacherExist || parentExist) {
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
  
        fs.unlinkSync(avatarLocalPath)

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

        await instituteAdminSchema.findByIdAndUpdate(user._id,{$set:{joinign_key:[{key_name:"studentKey",key_value:studentKey},{key_name:"teackerKey",key_value:teackerKey},{key_name:"parentKey",key_value:parentKey}],}})

        await paymentModel.findOneAndUpdate({email},{$set:{instituteAdmin:user._id}})

        const getPaymentInfo = await paymentModel.findOne({email})

        const pdf = generatePaymentPDF(getPaymentInfo)
        console.log(pdf);
        
        const pdfCloud = await uploadOnCloud(pdf)
        console.log(pdfCloud);

        

       const {data,error} = await sendAck(institute_name,email,contact_number,address,avatar.url,studentKey,teackerKey,parentKey,pdfCloud.secure_url)

       const ack = await instituteAdminSchema.findByIdAndUpdate(user._id,{$set: {paymentAck:pdfCloud.secure_url}})

       if (data === null) {
        await instituteAdminSchema.findByIdAndDelete(user._id)
        return res.status(400).json({message:"Something went wrong please try after sometime"})
       }

       fs.unlinkSync(pdf)

       return res.status(200).json({ack,message:"user created successfully",data,error})
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
})

const loginUser = AsyncHandler(async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res
          .status(400)
          .json({ message: "email and password both are required" });
      }
      console.log(email, password);
      
      const user = await instituteAdminSchema.findOne({ email });
      console.log(user);
      
  
      if (!user) {
        return res.status(300).json({ message: "user not found" });
      }
  
      const verifyPassword = await bcrytp.compare(password, user.password);
      console.log(verifyPassword);
      
  
      if (verifyPassword) {
        // const userToken = await generateTokenforUser(user);
        //res.cookie("userToken", userToken, { httpOnly: true, Scure: true });
        return res.status(200).json({ userId: user._id,message: "user log in successfully" });
      } else {
        return res.status(300).json({ message: "password incorrect" });
      }
    } catch (error) {
      return res.status(500).json({ message: error });
    }
});

const addMembers = AsyncHandler(async(req,res) => {
    try {
        const {key} = req.body
        if (!key) {
            return res.status(300).json({message:"Joining key not found"})
        }
        const {joinign_key} = await instituteAdminSchema.findOne({"joinign_key.key_value":key})
        if (!joinign_key) {
            return res.status(300).json({message:"institute not found"})
        }

        const result =  joinign_key.filter((data) => (data.key_value === key))
        
       return res.status(200).json({result})
    } catch (error) {
        return res.status(500).json({message:
            error
        })
    }
})

const getRequest = AsyncHandler(async(req,res) => {
    try {
        const {userId} = req.body
        if (!userId) {
            return res.status(300).json({message:"user id is required"})
        }

        const {request} = await instituteAdminSchema.findById(userId)
        if (!request) {
            return res.status(300).json({message:"request not found"})
        }
        return res.status(200).json({request})

    } catch (error) {
        return res.status(500).json({message:
            error
        })
    }
})

const aproveRequest = AsyncHandler(async(req,res) => {
    try {
        const {studentEmail,userId} = req.body 
        if (!studentEmail) {
            return res.status(300).json({message:"student email is required"})
        }
        const student = await studentModel.findOne({email:studentEmail})
        if (!student) {
            return res.status(300).json({message:"student not found"})
        }

        await instituteAdminSchema.findByIdAndUpdate(userId,{$push:{students:[{student_id:student._id,name:student.name,roll_number:student.roll_number}]}})

        await studentModel.findByIdAndUpdate(student._id,{$set:{current_institute:userId, isApproverd:true}})

        await instituteAdminSchema.findByIdAndUpdate(userId,{$pull:{request:{email:studentEmail}},})

        return res.status(200).json({message:"student added successfully"})
    } catch (error) {
       return res.status(500).json({message:
            error
        }) 
    }
})

export {registerInstituteAdmin,addMembers,getRequest,aproveRequest,loginUser}