import bcrypt from "bcryptjs";
import instituteAdminSchema from "../models/instituteadmin.model.js";
import parentModel from "../models/parent.model.js";
import studentModel from "../models/student.model.js";
import teacherModel from "../models/teacher.model.js";

const loginUser = async (req, res) => {
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

const getMemberBykey = async (req, res) => {
  try {
    const { key } = req.body;

    if (!key) {
      return res.status(300).json({ message: "Joining key not found" });
    }
    const { joinign_key } = await instituteAdminSchema.findOne({
      "joinign_key.key_value": key,
    });
    if (!joinign_key) {
      return res.status(300).json({ message: "institute not found" });
    }

    const result = joinign_key.filter((data) => data.key_value === key);

    return res.status(200).json({ result });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

const getRequest = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(300).json({ message: "user id is required" });
    }

    const { request } = await instituteAdminSchema.findById(userId);
    if (!request) {
      return res.status(300).json({ message: "request not found" });
    }
    return res.status(200).json({ request });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

const aproveStudentRequest = async (req, res) => {
  try {
    const { studentEmail, userId } = req.body;
    if (!studentEmail) {
      return res.status(300).json({ message: "student email is required" });
    }
    const student = await studentModel.findOne({ email: studentEmail });
    if (!student) {
      return res.status(300).json({ message: "student not found" });
    }

    await instituteAdminSchema.findByIdAndUpdate(userId, {
      $push: {
        students: [
          {
            student_id: student._id,
            name: student.name,
            roll_number: student.roll_number,
          },
        ],
      },
    });

    await studentModel.findByIdAndUpdate(student._id, {
      $set: { current_institute: userId, isApproverd: true },
    });

    await instituteAdminSchema.findByIdAndUpdate(userId, {
      $pull: { request: { email: studentEmail } },
    });

    return res.status(200).json({ message: "student added successfully" });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

const aproveTeacherRequest = async (req, res) => {
  try {
    const { teacherEmail, userId } = req.body;
    if (!teacherEmail) {
      return res.status(300).json({ message: "Teacher email is required" });
    }
    const teacher = await teacherModel.findOne({ email: teacherEmail });
    if (!teacher) {
      return res.status(300).json({ message: "Teacher not found" });
    }

    await instituteAdminSchema.findByIdAndUpdate(userId, {
      $push: { teachers: [{ teacher_id: teacher._id, name: teacher.name }] },
    });

    await teacherModel.findByIdAndUpdate(teacher._id, {
      $set: { current_institute: userId, isApproverd: true },
    });

    await instituteAdminSchema.findByIdAndUpdate(userId, {
      $pull: { request: { email: teacherEmail } },
    });

    return res.status(200).json({ message: "Teacher added successfully" });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

const aproveParentRequest = async (req, res) => {
  try {
    const { parentEmail, userId } = req.body;
    if (!parentEmail) {
      return res.status(300).json({ message: "parent email is required" });
    }
    const parent = await parentModel.findOne({ email: parentEmail });
    if (!parent) {
      return res.status(300).json({ message: "parent not found" });
    }

    await instituteAdminSchema.findByIdAndUpdate(userId, {
      $push: { parents: [{ parent_id: parent._id, name: parent.name }] },
    });

    await parentModel.findByIdAndUpdate(parent._id, {
      $set: { current_institute: userId, isApproverd: true },
    });

    await instituteAdminSchema.findByIdAndUpdate(userId, {
      $pull: { request: { email: parentEmail } },
    });

    return res.status(200).json({ message: "parent added successfully" });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

const addFeesRecord = async (req, res) => {
  try {
    const { student_id, totalAmount, amount, instituteAdminId } = req.body;

    const newRecord = {
      student_id,
      totalAmount,
      paidAmount: 0,
      amount,
      date: new Date(),
    };

    const updatedAdmin = await instituteAdminSchema
      .findByIdAndUpdate(
        instituteAdminId,
        { $push: { fees_record: newRecord } },
        { new: true, upsert: true }
      )
      .populate("fees_record.student_id");

    return res.status(201).json(updatedAdmin.fees_record);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const getStudentFeesRecords = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { instituteAdminId } = req.body;

    const superAdmin = await instituteAdminSchema
      .findOne(instituteAdminId)
      .populate({
        path: "fees_record.student_id",
        match: { _id: studentId },
      });

    const filteredRecords = superAdmin.fees_record.filter(
      (record) =>
        record.student_id && record.student_id._id.toString() === studentId
    );

    return res.json(filteredRecords);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateFeesRecord = async (req, res) => {
  try {
    const { feeRecordId } = req.params;
    const { amount } = req.body;

    const updatedAdmin = await instituteAdminSchema
      .findOneAndUpdate(
        { "fees_record._id": feeRecordId },
        {
          $inc: { "fees_record.$.paidAmount": amount },
          $set: { "fees_record.$.date": new Date() },
        },
        { new: true }
      )
      .populate("fees_record.student_id");

    if (!updatedAdmin) {
      return res.status(404).json({ message: "Fee record not found" });
    }

    const updatedRecord = updatedAdmin.fees_record.find(
      (record) => record._id.toString() === feeRecordId
    );

    return res.json(updatedRecord);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const addPettyCash = async (req, res) => {
  try {
    const { instituteAdminId } = req.params;
    const { amount, description } = req.body;

    const updatedAdmin = await instituteAdminSchema.findByIdAndUpdate(
      instituteAdminId,
      {
        $push: {
          petty_cash: {
            amount,
            description,
            date: new Date(),
          },
        },
      },
      { new: true }
    );

    return res.status(201).json(updatedAdmin.petty_cash);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const getPettyCash = async (req, res) => {
  try {
    const { instituteAdminId } = req.params;
    const admin = await instituteAdminSchema.findById(instituteAdminId);
    return res.json(admin.petty_cash);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const addLibraryBook = async (req, res) => {
  try {
    const { instituteAdminId } = req.params;
    const { book_name, author, is_borrowed, student_id } = req.body;

    const newBook = {
      book_name,
      author,
      is_borrowed: is_borrowed || false,
      date: new Date(),
      student_id,
    };

    const updatedAdmin = await instituteAdminSchema
      .findByIdAndUpdate(
        instituteAdminId,
        { $push: { library: newBook } },
        { new: true }
      )
      .populate("library.student_id");

    return res.status(201).json(updatedAdmin.library);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const getLibraryBooks = async (req, res) => {
  try {
    const { instituteAdminId } = req.params;
    const admin = await instituteAdminSchema
      .findById(instituteAdminId)
      .populate("library.student_id");
    return res.json(admin.library);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const addEvent = async (req, res) => {
  try {
    const { instituteAdminId } = req.params;
    const { title, description, date } = req.body;

    const newEvent = {
      title,
      description,
      date: date || new Date(),
    };

    const updatedAdmin = await instituteAdminSchema.findByIdAndUpdate(
      instituteAdminId,
      { $push: { events: newEvent } },
      { new: true }
    );

    return res.status(201).json(updatedAdmin.events);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const getEvents = async (req, res) => {
  try {
    const { instituteAdminId } = req.params;
    const admin = await instituteAdminSchema.findById(instituteAdminId);
    return res.json(admin.events);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const addExpense = async (req, res) => {
  try {
    const { instituteAdminId } = req.params;
    const { description, amount } = req.body;

    const newExpense = {
      description,
      amount,
      date: new Date(),
    };

    const updatedAdmin = await instituteAdminSchema.findByIdAndUpdate(
      instituteAdminId,
      { $push: { expenses: newExpense } },
      { new: true }
    );

    return res.status(201).json(updatedAdmin.expenses);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const getExpenses = async (req, res) => {
  try {
    const { instituteAdminId } = req.params;
    const admin = await instituteAdminSchema.findById(instituteAdminId);
    return res.json(admin.expenses);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const addTeacherSalary = async (req, res) => {
  try {
    const { instituteAdminId } = req.params;
    const { teacher_id, amount } = req.body;

    const newSalary = {
      teacher_id,
      amount,
      paid: false,
    };

    const updatedAdmin = await instituteAdminSchema
      .findByIdAndUpdate(
        instituteAdminId,
        { $push: { teacher_salary: newSalary } },
        { new: true }
      )
      .populate("teacher_salary.teacher_id");

    return res.status(201).json(updatedAdmin.teacher_salary);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const updateTeacherSalary = async (req, res) => {
  try {
    const { instituteAdminId, salaryId } = req.params;
    const updateData = req.body;

    const updatedAdmin = await instituteAdminSchema
      .findOneAndUpdate(
        {
          _id: instituteAdminId,
          "teacher_salary._id": salaryId,
        },
        {
          $set: {
            "teacher_salary.$.amount": updateData.amount,
            "teacher_salary.$.paid": updateData.paid,
            "teacher_salary.$.date": new Date(),
          },
        },
        { new: true }
      )
      .populate("teacher_salary.teacher_id");

    if (!updatedAdmin) {
      return res.status(404).json({ message: "Salary record not found" });
    }

    const updatedSalary = updatedAdmin.teacher_salary.find(
      (s) => s._id.toString() === salaryId
    );

    return res.json(updatedSalary);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const getTeacherSalaries = async (req, res) => {
  try {
    const { instituteAdminId } = req.params;
    const admin = await instituteAdminSchema
      .findById(instituteAdminId)
      .populate("teacher_salary.teacher_id");
    return res.json(admin.teacher_salary);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getCurrentInstitute = async (req, res) => {
  try {
    const { instituteAdminId } = req.params;
    const admin = await instituteAdminSchema.findById(instituteAdminId);
    return res.json(admin);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updatePassword = async (req, res) => {
  try {
    const { instituteAdminId } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        message: "At least one of password or address must be provided",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const updatedAdmin = await instituteAdminSchema.findByIdAndUpdate(
      instituteId,
      { password: hashedPassword },
      { new: true }
    );

    return res.status(200).json(updatedAdmin);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export {
  getMemberBykey,
  getRequest,
  aproveStudentRequest,
  loginUser,
  aproveTeacherRequest,
  aproveParentRequest,
  addFeesRecord,
  getStudentFeesRecords,
  updateFeesRecord,
  addPettyCash,
  getPettyCash,
  addLibraryBook,
  getLibraryBooks,
  addEvent,
  getEvents,
  addExpense,
  getExpenses,
  addTeacherSalary,
  updateTeacherSalary,
  getTeacherSalaries,
  getCurrentInstitute,
  updatePassword,
};
