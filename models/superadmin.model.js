import mongoose from "mongoose";

const SuperadminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  institutes: [
    {
      institute_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Institute' },
      institute_name: { type: String }
    }
  ],
  notifications: [
    {
      message: { type: String },
      created_at: { type: Date, default: Date.now }
    }
  ],
  settings: {
    global_rules: { type: String },
    payment_gateway: { type: String },
    email_service: { type: String }
  }
});

const Superadmin = mongoose.model('Superadmin', SuperadminSchema);

export default Superadmin

