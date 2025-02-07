import mongoose from "mongoose";

const TeacherSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  contact_number: { type: String, required: true },
  address: { type: String },
  subjects: [{ type: String }],
  dateOfBirth: {
    type: Date,
  },
  gender: {
    type: String,
  },
  classes: [
    {
      class_id: { type: mongoose.Schema.Types.ObjectId, ref: "Class" },
      division: { type: String },
    },
  ],
  aadharCardNumber: {
    type: String,
    required: true,
    unique: true,
  },
  avatar: {
    type: String,
  },
  current_institute: {
    institute_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "InstituteAdmin",
    },
  },
  isApproverd: { type: Boolean, default: false },
  isVerified: { type: Boolean, default: false },
  isRejected: { type: Boolean, default: false },
  isDeleted: { type: Boolean, default: false },
  institute_history: [
    {
      instituteId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "InstituteAdmin",
      },
    },
  ],
});

const Teacher = mongoose.model("Teacher", TeacherSchema);

export default Teacher;
