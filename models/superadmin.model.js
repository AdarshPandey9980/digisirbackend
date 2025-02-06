import {Schema, mongoose} from 'mongoose'

const superAdminSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  mobile_number: { type: String, required: true },
  avatar: { type: String },
  institutes: [{ type: Schema.Types.ObjectId, ref: 'InstituteAdmin' }],
  requests: [
    {
      name: String,
      email: String,
      mobile_number: String,
      message: String,
    }
  ],
  // Payment record management for institutes
  institute_payments: [
    {
      institute_id: { type: Schema.Types.ObjectId, ref: 'InstituteAdmin', required: true },
      amount: { type: Number, required: true },
      payment_method: { type: String, enum: ['offline', 'online'], required: true },
      payment_date: { type: Date, default: Date.now }
    }
  ],
  piticash: [{ amount: Number, description: String, date: Date }],
});


const SuperAdmin = mongoose.model('SuperAdmin', superAdminSchema);

export default SuperAdmin
