import { Schema, mongoose } from "mongoose";

const superAdminSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  mobile_number: { type: String, required: true },
  avatar: { type: String },
  institutes: [
    {
      type: Schema.Types.ObjectId,
      ref: "InstituteAdmin",
    },
  ],
  requests: [
    {
      name: String,
      email: String,
      mobile_number: String,
      message: String,
    },
  ],
  institute_payments: [
    {
      institute_id: {
        type: Schema.Types.ObjectId,
        ref: "InstituteAdmin",
      },
      amount: { type: Number },
      payment_method: {
        type: String,
        enum: ["offline", "online"],
      },
      payment_date: { type: Date, default: Date.now },
    },
  ],
});

const SuperAdmin = mongoose.model("SuperAdmin", superAdminSchema);

export default SuperAdmin;
