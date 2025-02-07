import Razorpay from "razorpay";
import crypto from "crypto";
import dotenv from "dotenv"
import paymentModel from "../models/payment.model.js";
dotenv.config();


// Initialize Razorpay instance
const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID, // Your Razorpay Key ID
  key_secret: process.env.RAZORPAY_KEY_SECRET, // Your Razorpay Secret
});

// Create Order
export const createOrder = async (req, res) => {
  try {
    const { amount, currency, name,email } = req.body; // Amount in the smallest currency unit (e.g., paise for INR)
    const options = {
      amount: amount * 100, // Convert amount to paise (e.g., 500 => 50000)
      currency: currency || "INR",
      receipt: `receipt_${Date.now()}`, // Unique receipt ID
    };
    const order = await razorpayInstance.orders.create(options);
    console.log(order);
    const ack = await paymentModel.create({receiptId:order.receipt,orderId:order.id,amount:order.amount,currency:order.currency,status:order.status,email,name});
    res.status(200).json(order);
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    res.status(500).json({ message: "Failed to create order" });
  }
};

// Verify Payment
export const verifyPayment = async (req, res) => {
  try {
    const { order_id, payment_id, signature } = req.body;

    // Generate expected signature using the secret
    const body = `${order_id}|${payment_id}`;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");
    
    console.log(order_id);
    console.log(payment_id);
    console.log(signature);
    console.log(expectedSignature);
    // console.log(prefill);

    const ack = await paymentModel.findOneAndUpdate({orderId:order_id},{$set:{signature,paymentId:payment_id,status:"captured"}})
    console.log(ack);
    if(!ack) {
        return res.status(400).json({message:"payment not found"})
    }
    if (expectedSignature === signature) {
      res.status(200).json({ message: "Payment verified successfully!" });
    } else {
      res.status(400).json({ message: "Invalid signature" },{});
    }
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({ message: "Payment verification failed" });
  }
};
