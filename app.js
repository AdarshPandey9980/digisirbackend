import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import cookieParser from 'cookie-parser'
import loginRouter from "./router/login.routes.js"
import paymentRoutes from './router/payment.route.js'
import instituteAdminRoute from "./router/instituteAdmin.routes.js"

dotenv.config()

const app = express()

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static("public"))
app.use(cors({
    // origin:"*",
    origin: 'http://localhost:5173', // Vite's default dev server // Allowed methods
    credentials: true,              // Allow cookies
}));
app.use("/api/auth/tempLogin", loginRouter);
app.use("/api/payment", paymentRoutes);
app.use("/api/instituteAdmin", instituteAdminRoute);

export default app