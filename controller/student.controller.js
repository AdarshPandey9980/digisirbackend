import bcrypt from "bcryptjs";
import instituteAdminSchema from "../models/instituteadmin.model.js";
import uploadOnCloud from "../utils/cloudnary.utils.js";
import fs from "fs";
import parentModel from "../models/parent.model.js";
import studentModel from "../models/student.model.js";
import teacherModel from "../models/teacher.model.js";

const registerStudent = async (req, res) => {
  try {
    const { email } = req.body;

    const userExists = await instituteAdminSchema.findOne({ email });
    const studentExist = await studentModel.findOne({ email });
    const teacherExist = await teacherModel.findOne({ email });
    const parentExist = await parentModel.findOne({ email });
    if (userExists || studentExist || teacherExist || parentExist) {
      return res.status(300).json({ message: "user already exist" });
    }

    const {
      name,
      address,
      password,
      contact_number,
      aadharCardNumber,
      dateOfBirth,
      gender,
    } = req.body;

    if (
      !name ||
      !address ||
      !password ||
      !contact_number ||
      !aadharCardNumber
    ) {
      return res.status(400).json({ message: "all field are required" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const hashedAadharCardNumber = await bcrypt.hash(aadharCardNumber, salt);

    const avatarLocalPath = await req.file?.path;

    if (!avatarLocalPath) {
      return res.status(400).json({ message: "avatar not found" });
    }

    const avatar = await uploadOnCloud(avatarLocalPath);

    fs.unlinkSync(avatarLocalPath);

    const user = await studentModel.create({
      name,
      address,
      password: hashedPassword,
      contact_number,
      aadharCardNumber: hashedAadharCardNumber,
      avatar: avatar.url,
      email,
      dateOfBirth,
      gender,
    });

    return res
      .status(200)
      .json({ user, message: "student created successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
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

    const verifyPassword = await bcrypt.compare(password, user.password);
    console.log(verifyPassword);

    if (verifyPassword) {
      return res
        .status(200)
        .json({ userId: user._id, message: "user log in successfully" });
    } else {
      return res.status(300).json({ message: "password incorrect" });
    }
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

const joinInstitute = async (req, res) => {
  try {
    const { key, userId } = req.body;
    if (!key) {
      return res.status(300).json({ message: "institute key required" });
    }
    const { _id } = await instituteAdminSchema.findOne({
      "joinign_key.key_value": key,
    });

    if (!_id) {
      return res.status(300).json({ message: "institute not found" });
    }

    const user = await studentModel.findById(userId);

    const result = await instituteAdminSchema.findByIdAndUpdate(_id, {
      $push: {
        request: [
          {
            type: "student",
            name: user.name,
            aadharCardNumber: user.aadharCardNumber,
            email: user.email,
          },
        ],
      },
    });

    return res.status(200).json({ result });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

const getAllStudents = async (req, res) => {
  const { instituteId } = req.body;

  if (!instituteId) {
    return res.status(400).json({ message: "Institute ID is required." });
  }

  try {
    // Find all students associated with the given instituteId
    const institute = await instituteAdminSchema
      .findById(instituteId)
      .populate("students");

    if (!institute) {
      return res.status(404).json({ message: "Institute not found." });
    }
    console.log(institute.students);
    return res.status(200).json({ result: institute.students });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getStudentLectures = async (req, res) => {
  try {
    const { studentId } = req.params;

    //   const lectures = await lectureModel.find({ studentIds: studentId }).populate('teacherId', 'name email');

    res.status(200).json({ lectures });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

const checkApprovalStatus = async (req, res) => {
  const { userId } = req.params;

  try {
    // Find the student by userId
    const student = await studentModel.findOne({ _id: userId });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Debugging Logs
    console.log("Student Found:", student);
    console.log("isApproved:", student.isApproverd);
    console.log("current_institute:", student.current_institute);
    const instituteId = student.current_institute;

    // Check if the student's request is approved
    if (student.isApproverd) {
      // Fetch the institute details using the current_institute field (instituteId)
      const institute = await instituteAdminSchema.findById(instituteId); // Use findById for MongoDB
      console.log(institute);
      if (institute) {
        return res.status(200).json({
          status: "approved",
          instituteId: institute._id,
          instituteName: institute.name,
          instituteDescription: institute.description, // Include other details here as needed
        });
      } else {
        return res.status(404).json({ message: "Institute not found" });
      }
    } else {
      return res.status(200).json({ status: "pending" });
    }
  } catch (error) {
    console.error("Error checking approval status:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const getInstituteDetails = async (req, res) => {
  const { instituteId } = req.params;

  try {
    // Fetch the institute by instituteId using Mongoose's findById
    const institute = await studentModel.findById(instituteId);

    if (!institute) {
      return res.status(404).json({ message: "Institute not found" });
    }

    // Return institute details
    return res.status(200).json({
      instituteId: institute._id,
      instituteName: institute.institute_name,
      instituteLocation: institute.address,
      instituteContact: institute.contact_number,
      instituteEmail: institute.email, // Include other relevant fields here
    });
  } catch (error) {
    console.error("Error fetching institute details:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateInstituteHistory = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { instituteId } = req.body;

    const updatedStudent = await studentModel.findByIdAndUpdate(
      studentId,
      { $push: { institute_history: { instituteId } } },
      { new: true }
    );

    if (!updatedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }

    return res.status(200).json({
      message: "Institute history updated successfully",
      data: updatedStudent,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error updating institute history",
      error: error.message,
    });
  }
};

const updateRemarks = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { instituteId, remark } = req.body;

    const updatedStudent = await studentModel.findByIdAndUpdate(
      studentId,
      { $push: { remarks: { instituteId, remark } } },
      { new: true }
    );

    if (!updatedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }

    return res
      .status(200)
      .json({ message: "Remarks updated successfully", data: updatedStudent });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error updating remarks", error: error.message });
  }
};

const getRemarksByAadhar = async (req, res) => {
  try {
    const { aadharCardNumber } = req.params;
    if (!aadharCardNumber) {
      return res
        .status(400)
        .json({ message: "Aadhar card number is required" });
    }

    const student = await studentModel.findOne({ aadharCardNumber });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    return res.status(200).json({ remarks: student.remarks });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updatePassword = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        message: "At least one of password or address must be provided",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const updatedStudent = await studentModel.findByIdAndUpdate(
      studentId,
      { password: hashedPassword },
      { new: true }
    );

    return res.status(200).json(updatedStudent);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export {
  registerStudent,
  loginUser,
  joinInstitute,
  getAllStudents,
  getStudentLectures,
  checkApprovalStatus,
  getInstituteDetails,
  updateInstituteHistory,
  updateRemarks,
  getRemarksByAadhar,
  updatePassword,
};
