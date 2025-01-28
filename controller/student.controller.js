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
  
const registerStudent = AsyncHandler(async (req, res) => {
    try {
        const {email} = req.body

        const userExists = await instituteAdminSchema.findOne({email})
        const studentExist = await studentModel.findOne({email})
        const teacherExist = await teacherModel.findOne({email})
        const parentExist = await parentModel.findOne({email})
        if (userExists || studentExist || teacherExist || parentExist) {
            return res.status(300).json({message:"user already exist"})
        }

        const {name,address,password,contact_number,aadharCardNumber} = req.body

        if (!name || !address || !password || !contact_number || !aadharCardNumber) {
            return res.status(400).json({message:"all field are required"})
        }

        const salt = await bcrytp.genSalt(10);
        const hashedPassword = await bcrytp.hash(password, salt);
        const hashedAadharCardNumber = await bcrytp.hash(aadharCardNumber, salt);

        const avatarLocalPath = await req.file?.path;
        
        if (!avatarLocalPath) {
            return res.status(400).json({message:"avatar not found"})
        }
  
        const avatar = await uploadOnCloud(avatarLocalPath);
  
        fs.unlinkSync(avatarLocalPath)

        const user = await studentModel.create({
            name,
            address,
            password: hashedPassword,
            contact_number,
            aadharCardNumber: hashedAadharCardNumber,
            avatar: avatar.url,
            email
        })

       return res.status(200).json({user,message:"student created successfully"})
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
      
      const user = await studentModel.findOne({ email });
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

const joinInstitute = AsyncHandler(async (req, res) => {
    try {
       const {key,userId} = req.body;
       if (!key) {
        return res.status(300).json({message:"institute key required"})
       }
       const {_id} = await instituteAdminSchema.findOne({"joinign_key.key_value":key})

       if (!_id) {
        return res.status(300).json({message:"institute not found"})
       }

       const user = await studentModel.findById(userId)

       const result = await instituteAdminSchema.findByIdAndUpdate(_id,{$push:{request:[{type:"student",name:user.name,aadharCardNumber:user.aadharCardNumber,email:user.email}],}})
       
       return res.status(200).json({result})
    } catch (error) {
        return res.status(500).json({ message: error });
    }
})

const getAllStudents = AsyncHandler(async(req,res) => {
    try {
        const result = await studentModel.find()
        return res.status(200).json({result})
    } catch (error) {
        return res.status(500).json({message:
            error
        })
    }
})


export {registerStudent,loginUser,joinInstitute,getAllStudents}