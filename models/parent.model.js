import mongoose  from "mongoose";

const ParentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    aadharCardNumber: { type: String, required: true,unique: true },
    contact_number: { type: String, required: true },
    address: { type: String },
    avatar: { type: String },
    children: [
      {
        student_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
        name: { type: String },
        email:{type:String},
        roll_number: { type: String },
        class_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' }
      }
    ],
    notifications: [
      {
        message: { type: String },
        date: { type: Date }
      }
    ],
    attendance_updates: [
      {
        student_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
        date: { type: Date },
        status: { type: String }
      }
    ],
    fees_reminders: [
      {
        student_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
        amount_due: { type: Number },
        due_date: { type: Date }
      }
    ],
    test_reports: [
      {
        student_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
        test_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Test' },
        marks: { type: Number },
        remarks: { type: String }
      }
    ],
    current_institute: {
      institute_id: { type: mongoose.Schema.Types.ObjectId, ref: 'InstituteAdmin' },
    },
    isApproverd: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    isRejected: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false }, 
    institute_history:[
      {
          instituteId: { type: mongoose.Schema.Types.ObjectId, ref: 'InstituteAdmin' },
      }
  ],
  });

  const Parent = mongoose.model('Parent', ParentSchema);

  export default Parent