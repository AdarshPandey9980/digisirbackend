import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  receiptId: {
    type: String,
    required: true,
    unique: true,
  },
  orderId: {
    type: String,
    required: true,
    unique: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    required: true,
    default: "INR",
  },
  status: {
    type: String,
  },
  signature: {
    type: String, // Can be updated post-payment
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  // Payer Information
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    paymentId: {
      type: String,
    },
    instituteAdmin: {
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'InstituteAdmin',
    }
});

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;
