import SuperAdmin from "../models/superadmin.model.js";
import bcrypt from "bcrypt";
import uploadOnCloud from "../utils/cloudnary.utils.js";
import instituteAdminSchema from "../models/instituteadmin.model.js";
import parentModel from "../models/parent.model.js";
import studentModel from "../models/student.model.js";
import teacherModel from "../models/teacher.model.js";
import { sendAck } from "../utils/resentEmailService.utils.js";
import fs from "fs";

const register = async (req, res) => {
  try {
    const { name, email, password, mobile_number } = req.body;
    if (!name || !email || !password || !mobile_number) {
      return res.status(400).json({ message: "all field are required" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const avatarLocalPath = await req.file?.path;

    if (!avatarLocalPath) {
      return res.status(400).json({ message: "avatar is required" });
    }

    const avatar = await uploadOnCloud(avatarLocalPath);
    console.log(avatar);

    fs.unlinkSync(avatarLocalPath);

    const user = await SuperAdmin.create({
      name,
      email,
      password: hashedPassword,
      mobile_number,
      avatar: avatar.url,
    });

    console.log(user);

    await user.save();

    return res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json({ message: error });
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

    const user = await SuperAdmin.findOne({ email });
    console.log(user);

    if (!user) {
      return res.status(300).json({ message: "user not found" });
    }

    const verifyPassword = await bcrypt.compare(password, user.password);
    console.log(verifyPassword);

    if (verifyPassword) {
      // const userToken = await generateTokenforUser(user);
      //res.cookie("userToken", userToken, { httpOnly: true, Scure: true });
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

const registerInstituteAdmin = async (req, res) => {
  try {
    const {
      email,
      institute_name,
      address,
      password,
      contact_number,
      aadharCardNumber,
      superAdminId,
      dateOfBirth,
    } = req.body;

    const userExists = await instituteAdminSchema.findOne({ email });
    const studentExist = await studentModel.findOne({ email });
    const teacherExist = await teacherModel.findOne({ email });
    const parentExist = await parentModel.findOne({ email });
    if (
      userExists ||
      studentExist ||
      teacherExist ||
      parentExist ||
      superAdminId
    ) {
      return res.status(300).json({ message: "user already exist" });
    }

    if (
      !institute_name ||
      !address ||
      !password ||
      !contact_number ||
      !aadharCardNumber ||
      !dateOfBirth
    ) {
      return res.status(400).json({ message: "all field are required here" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const hashedAadharCardNumber = await bcrypt.hash(aadharCardNumber, salt);

    const avatarLocalPath = await req.file?.path;

    if (!avatarLocalPath) throw new Error("avatar not found");

    const avatar = await uploadOnCloud(avatarLocalPath);

    fs.unlinkSync(avatarLocalPath);

    const user = await instituteAdminSchema.create({
      institute_name,
      address,
      password: hashedPassword,
      contact_number,
      aadharCardNumber: hashedAadharCardNumber,
      avatar: avatar.url,
      email,
      dateOfBirth,
    });

    const studentKey = `student_${institute_name}_${user._id}`;
    const teackerKey = `teacher_${institute_name}_${user._id}`;
    const parentKey = `parent_${institute_name}_${user._id}`;

    await instituteAdminSchema.findByIdAndUpdate(user._id, {
      $set: {
        joinign_key: [
          { key_name: "studentKey", key_value: studentKey },
          { key_name: "teackerKey", key_value: teackerKey },
          { key_name: "parentKey", key_value: parentKey },
        ],
      },
    });

    const { data, error } = await sendAck(
      institute_name,
      email,
      contact_number,
      address,
      avatar.url,
      studentKey,
      teackerKey,
      parentKey
    );

    if (error) {
      return res.status(400).json({ message: "failed to send a email res" });
    }

    const userId = user._id;

    await SuperAdmin.findByIdAndUpdate(superAdminId, {
      $push: { institutes: { userId } },
    });

    return res.status(200).json({ message: "User created succesfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const userEnquire = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, mobile_number, message } = req.body;

    if (!name || !email || !mobile_number || !message) {
      return res.status(400).json({ message: "all field are required" });
    }

    const user = await SuperAdmin.findByIdAndUpdate(id, {
      $push: { requests: { name, email, mobile_number, message } },
    });

    return res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

const getUserEnquire = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await SuperAdmin.findById(id).populate("requests");
    return res.status(200).json({ result });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

const getAllInstitue = async (req, res) => {
  try {
    const result = await instituteAdminSchema.find();
    return res.status(200).json({ result });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

const getOneInstitueInfo = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await instituteAdminSchema.findById(id);
    return res.status(200).json({ result });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

const addInstitutePayment = async (req, res) => {
  try {
    const { institute_id, amount, payment_method } = req.body;
    const superAdmin = await SuperAdmin.findOne();

    superAdmin.institute_payments.push({
      institute_id,
      amount,
      payment_method,
    });

    await superAdmin.save();
    return res.status(201).json(superAdmin.institute_payments);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const getInstitutePayments = async (req, res) => {
  try {
    const { instituteId } = req.params;
    const superAdmin = await SuperAdmin.findOne().populate(
      "institute_payments.institute_id"
    );

    const payments = superAdmin.institute_payments.filter(
      (payment) => payment.institute_id._id.toString() === instituteId
    );

    return res.json(payments);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updatePassword = async (req, res) => {
  try {
    const { adminId } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        message: "At least one of password or address must be provided",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const updatedAdmin = await instituteAdminSchema.findByIdAndUpdate(
      adminId,
      { password: hashedPassword },
      { new: true }
    );

    return res.status(200).json(updatedAdmin);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export {
  register,
  loginUser,
  registerInstituteAdmin,
  userEnquire,
  getUserEnquire,
  getAllInstitue,
  getOneInstitueInfo,
  addInstitutePayment,
  getInstitutePayments,
  updatePassword,
};
