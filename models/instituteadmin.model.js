import mongoose from "mongoose";

const InstituteAdminSchema = new mongoose.Schema({
    institute_name: { type: String, required: true },
    address: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    contact_number: { type: String },
    students: [
      {
        student_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
        name: { type: String },
        roll_number: { type: String }
      }
    ],
    teachers: [
      {
        teacher_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' },
        name: { type: String }
      }
    ],
    parents: [
      {
        parent_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Parent' },
        name: { type: String }
      }
    ],
    timetable: {
      classes: [
        {
          class_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
          division: { type: String },
          schedule: [
            {
              day: { type: String },
              time: { type: String },
              subject: { type: String },
              teacher_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' }
            }
          ]
        }
      ]
    },
    notices: [
      {
        type: { type: String },
        message: { type: String },
        created_at: { type: Date, default: Date.now }
      }
    ],
    fees_management: {
      records: [
        {
          student_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
          amount_paid: { type: Number },
          due_date: { type: Date },
          status: { type: String }
        }
      ]
    },
    performance_reports: [
      {
        student_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
        chapter_wise_progress: [
          {
            chapter: { type: String },
            marks: { type: Number },
            test_date: { type: Date }
          }
        ]
      }
    ],
    joinign_key: [
        {
            key_name: { type: String },
            key_value: {type: String},
            created_at: { type: Date, default: Date.now }
        }
    ],
    aadharCardNumber: {
      type: String,
      required: true
    },
    avatar: {
      type: String,
    },
  });

  const InstituteAdmin = mongoose.model('InstituteAdmin', InstituteAdminSchema);

  export default InstituteAdmin