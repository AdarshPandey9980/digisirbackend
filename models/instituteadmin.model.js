import mongoose, { Schema } from "mongoose";

const InstituteAdminSchema = new mongoose.Schema({
  institute_name: { type: String, required: true },
  address: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  contact_number: { type: String },
  dateOfBirth: {
    type: Date,
  },
  request: [
    {
      type: { type: String },
      name: { type: String },
      aadharCardNumber: { type: String },
      email: { type: String },
      created_at: { type: Date, default: Date.now },
    },
  ],
  students: [
    {
      student_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
        unique: true,
      },
      name: { type: String },
    },
  ],
  teachers: [
    {
      teacher_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Teacher",
        unique: true,
      },
      name: { type: String },
    },
  ],
  parents: [
    {
      parent_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Parent",
        unique: true,
      },
      name: { type: String },
    },
  ],
  joinign_key: [
    {
      key_name: { type: String },
      key_value: { type: String },
      created_at: { type: Date, default: Date.now },
    },
  ],
  aadharCardNumber: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
  },
  fees_record: [
    {
      student_id: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
      totalAmount: { type: Number },
      paidAmount: { type: Number },
      amount: Number,
      date: Date,
    },
  ],
  petty_cash: [{ amount: Number, description: String, date: Date }],
  library: [
    {
      book_name: String,
      author: String,
      is_borrowed: Boolean,
      date: Date,
      student_id: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
    },
  ],
  events: [{ title: String, description: String, date: Date }],
  teacher_salary: [
    {
      teacher_id: {
        type: Schema.Types.ObjectId,
        ref: "Teacher",
      },
      amount: { type: Number },
      date: { type: Date, default: Date.now },
      paid: { type: Boolean, default: false },
    },
  ],
  expenses: [
    {
      description: { type: String },
      amount: { type: Number },
      date: { type: Date, default: Date.now },
    },
  ],
  isApprover: {
    type: Boolean,
    default: false,
  },
});

const InstituteAdmin = mongoose.model("InstituteAdmin", InstituteAdminSchema);

export default InstituteAdmin;
