import mongoose from "mongoose";

const TeacherSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    subjects: [{ type: String }],
    classes: [
      {
        class_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
        division: { type: String }
      }
    ],
    attendance: [
      {
        date: { type: Date },
        status: { type: String } // Present, Absent, Late
      }
    ],
    timetable: [
      {
        day: { type: String },
        time: { type: String },
        class_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
        subject: { type: String }
      }
    ],
    test_paper_generator: [
      {
        test_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Test' },
        test_type: { type: String },
        syllabus: [{ type: String }],
        date: { type: Date }
      }
    ],
    notices: [
      {
        message: { type: String },
        date: { type: Date }
      }
    ],
    performance_reports: [
      {
        student_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
        chapter_wise_progress: [
          {
            chapter: { type: String },
            score: { type: Number }
          }
        ]
      }
    ]
  });

  const Teacher = mongoose.model('Teacher', TeacherSchema);

  export default Teacher
  