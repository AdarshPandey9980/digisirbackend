import mongoose  from "mongoose";

const ParentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    children: [
      {
        student_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
        name: { type: String },
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
    ]
  });

  const Parent = mongoose.model('Parent', ParentSchema);

  export default Parent