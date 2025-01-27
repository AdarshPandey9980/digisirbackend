import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import cookieParser from 'cookie-parser'
import loginRouter from "./router/login.routes.js"
import paymentRoutes from './router/payment.routes.js'
import instituteAdminRoute from "./router/instituteAdmin.routes.js"
import parentRoutes from "./router/parent.routes.js"
import studentRoutes from "./router/student.routes.js"
import teacherRoutes from "./router/teacher.routes.js"

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
app.use("/api/parent", parentRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/teacher", teacherRoutes);

export default app