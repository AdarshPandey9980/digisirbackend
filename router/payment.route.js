import express from "express";
import { createOrder, verifyPayment } from "../controller/payment.controller.js";

const router = express.Router();

// Route to create an order
router.route("/create-order").post(createOrder);

// Route to verify a payment
router.route("/verify-payment").post(verifyPayment);

export default router;
