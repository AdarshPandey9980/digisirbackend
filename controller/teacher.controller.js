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
//   import lectureModel from "../models/lecture.model.js";
//   import testModel from '../models/test.model.js';

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

        const user = await teacherModel.create({
            name,
            address,
            password: hashedPassword,
            contact_number,
            aadharCardNumber: hashedAadharCardNumber,
            avatar: avatar.url,
            email
        })

       return res.status(200).json({user,message:"teacher created successfully"})
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
      
      const user = await teacherModel.findOne({ email });
      console.log(user);
      
  
      if (!user) {
        return res.status(300).json({ message: "user not found" });
      }
  
      const verifyPassword = await bcrytp.compare(password, user.password);
      console.log(verifyPassword);
      
  
      if (verifyPassword) {
        // const userToken = await generateTokenforUser(user);
        //res.cookie("userToken", userToken, { httpOnly: true, Scure: true });
        return res.status(200).json({ userId: user._id,message: "teacher log in successfully" });
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

       const user = await teacherModel.findById(userId)

       const result = await instituteAdminSchema.findByIdAndUpdate(_id,{$push:{request:[{type:"teacher",name:user.name,aadharCardNumber:user.aadharCardNumber,email:user.email}],}})
       
       return res.status(200).json({result})
    } catch (error) {
        return res.status(500).json({ message: error });
    }
})

const getAllTeachers = AsyncHandler(async(req,res) => {
    try {
        const result = await teacherModel.find()
        return res.status(200).json({result})
    } catch (error) {
        return res.status(500).json({message:
            error
        })
    }
})

const getTeacherLectures = AsyncHandler(async(req,res) => {
    try {
      const { teacherId } = req.params;

    //   const lectures = await lectureModel.find({ teacherId }).populate('studentIds', 'name email');
  
      res.status(200).json({ lectures });
    } catch (error) {
        return res.status(500).json({message:
            error
        })
    }
})

export const updateSubjects = async (req, res) => {
    const { teacherId } = req.params;
    const { subjects } = req.body;

    try {
        const teacher = await teacherModel.findByIdAndUpdate(
            teacherId,
            { $set: { subjects: subjects } },
            { new: true }
        );

        if (!teacher) {
            return res.status(404).json({ message: "Teacher not found" });
        }

        res.status(200).json(teacher);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateClasses = async (req, res) => {
    const { teacherId } = req.params;
    const { classes } = req.body;

    try {
        const teacher = await teacherModel.findByIdAndUpdate(
            teacherId,
            { $set: { classes: classes } },
            { new: true }
        );

        if (!teacher) {
            return res.status(404).json({ message: "Teacher not found" });
        }

        res.status(200).json(teacher);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateAttendance = async (req, res) => {
    const { teacherId } = req.params;
    const { attendance } = req.body;

    try {
        const teacher = await teacherModel.findByIdAndUpdate(
            teacherId,
            { $push: { attendance: attendance } },
            { new: true }
        );

        if (!teacher) {
            return res.status(404).json({ message: "Teacher not found" });
        }

        res.status(200).json(teacher);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateNotices = async (req, res) => {
    const { teacherId } = req.params;
    const { notices } = req.body;

    try {
        const teacher = await teacherModel.findByIdAndUpdate(
            teacherId,
            { $push: { notices: notices } },
            { new: true }
        );

        if (!teacher) {
            return res.status(404).json({ message: "Teacher not found" });
        }

        res.status(200).json(teacher);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updatePerformanceReports = async (req, res) => {
    const { teacherId } = req.params;
    const { performance_reports } = req.body;

    try {
        const teacher = await teacherModel.findByIdAndUpdate(
            teacherId,
            { $push: { performance_reports: performance_reports } },
            { new: true }
        );

        if (!teacher) {
            return res.status(404).json({ message: "Teacher not found" });
        }

        res.status(200).json(teacher);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const generateTestPaper = async (req, res) => {
    const { teacherId, classId, title, questions, duration, syllabus, max_marks } = req.body;

    try {
        // const test = new testModel({
        //     title,
        //     teacher_id: teacherId,
        //     class_id: classId,
        //     questions,
        //     duration,
        //     syllabus,
        //     max_marks
        // });

        await test.save();

        // Update the teacher's test_paper_generator array
        const teacher = await teacherModel.findByIdAndUpdate(
            teacherId,
            { $push: { test_paper_generator: { test_id: test._id, test_type: "Generated", syllabus, date: new Date() } } },
            { new: true }
        );

        if (!teacher) {
            return res.status(404).json({ message: "Teacher not found" });
        }

        res.status(201).json(test);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export {registerStudent,loginUser,joinInstitute,getAllTeachers,getTeacherLectures}