import bcrypt from "bcryptjs";
import instituteAdminSchema from "../models/instituteadmin.model.js";
import uploadOnCloud from "../utils/cloudnary.utils.js";
import fs from "fs";
import parentModel from "../models/parent.model.js";
import studentModel from "../models/student.model.js";
import teacherModel from "../models/teacher.model.js";

const registerTeacher = async (req, res) => {
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

    const user = await teacherModel.create({
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
      .json({ user, message: "teacher created successfully" });
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

    const user = await teacherModel.findOne({ email });
    console.log(user);

    if (!user) {
      return res.status(300).json({ message: "user not found" });
    }

    const verifyPassword = await bcrypt.compare(password, user.password);
    console.log(verifyPassword);

    if (verifyPassword) {
      return res
        .status(200)
        .json({ userId: user._id, message: "teacher log in successfully" });
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

    const user = await teacherModel.findById(userId);

    const result = await instituteAdminSchema.findByIdAndUpdate(_id, {
      $push: {
        request: [
          {
            type: "teacher",
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

const getTeachersDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await teacherModel.findById(id);
    return res.status(200).json({ result });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

const updateSubjects = async (req, res) => {
  try {
    const { id } = req.params;
    const { subject } = req.body;
    await teacherModel.findByIdAndUpdate(id, { $push: { subjects: subject } });
    return res.status(200).json({ message: "subject added successfully" });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

const updatePassword = async (req, res) => {
  try {
    const { teacherId } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        message: "At least one of password or address must be provided",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const updatedTeacher = await teacherModel.findByIdAndUpdate(
      teacherId,
      { password: hashedPassword },
      { new: true }
    );

    return res.status(200).json(updatedTeacher);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export {
  registerTeacher,
  loginUser,
  joinInstitute,
  getTeachersDetail,
  updatePassword,
  updateSubjects,
};
