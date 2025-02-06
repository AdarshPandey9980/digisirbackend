import mongoose, {Schema} from "mongoose";

const StudentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    aadharCardNumber: { type: String, required: true,unique: true },
    contact_number: { type: String, required: true },
    address: { type: String },
    avatar: { type: String },
    dateOfBirth:{
      type:Date
    },
    fees: { type: Number },
    tests: [{ type: Schema.Types.ObjectId, ref: 'Test' }],
    
    parent_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Parent' },   
    institute_history:[
        {
            instituteId: { type: mongoose.Schema.Types.ObjectId, ref: 'InstituteAdmin' },
        }
    ],
    remarks:[
      {
        Institute_name: {type: String},
        remark: { type: String }
      }
    ],
    current_institute: {
      institute_id: { type: mongoose.Schema.Types.ObjectId, ref: 'InstituteAdmin' },
    },
    class:{
      type: mongoose.Schema.Types.ObjectId, ref: 'Classes'
    },
    isApproverd: { type: Boolean, default: false },
  });

  const Student = mongoose.model('Student', StudentSchema);
  export default Student
  