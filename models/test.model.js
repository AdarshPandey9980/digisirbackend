const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const testSchema = new Schema({
  test_name: { type: String, required: true },
  class_id: { type: Schema.Types.ObjectId, ref: 'Class', required: true },
  subject: { type: String, required: true },
  teacher_id: { type: Schema.Types.ObjectId, ref: 'Teacher', required: true },
  date: { type: Date, required: true },
  total_marks: { type: Number, required: true },
  questions: [
    {
      question: { type: String, required: true },
      options: [
        { option: { type: String }, correct: { type: Boolean } }
      ],
      marks: { type: Number, required: true }
    }
  ],
  students: [
    {
      student_id: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
      marks_obtained: { type: Number, default: 0 }
    }
  ]
});

module.exports = mongoose.model('Test', testSchema);
