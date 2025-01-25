import mongoose from "mongoose";

const StudentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    roll_number: { type: String, required: true },
    class_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
    division: { type: String },
    attendance: [
      {
        date: { type: Date },
        status: { type: String } // Present, Absent, Late
      }
    ],
    performance: {
      tests: [
        {
          test_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Test' },
          marks: { type: Number },
          total_marks: { type: Number },
          test_date: { type: Date }
        }
      ],
      progress_reports: [
        {
          chapter: { type: String },
          score: { type: Number }
        }
      ]
    },
    emergency_alerts: [
      {
        type: { type: String },
        date: { type: Date },
        status: { type: String }
      }
    ],
    enrollment: {
      admission_date: { type: Date },
      status: { type: String }
    },
    notes: [
      {
        title: { type: String },
        content: { type: String },
        is_paid: { type: Boolean }
      }
    ],
    test_history: [
      {
        test_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Test' },
        marks: { type: Number },
        remarks: { type: String }
      }
    ]
  });

  const Student = mongoose.model('Student', StudentSchema);
  export default Student
  