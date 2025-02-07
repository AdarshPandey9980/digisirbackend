import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import paymentRoutes from "./router/payment.routes.js";
import instituteAdminRoute from "./router/instituteAdmin.routes.js";
import parentRoutes from "./router/parent.routes.js";
import studentRoutes from "./router/student.routes.js";
import teacherRoutes from "./router/teacher.routes.js";
import superAdmin from "./router/superAdmin.routes.js";
import classRoutes from "./router/class.routes.js";
import commonRoutes from "./router/common.routes.js";

dotenv.config();

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use("/api/payment", paymentRoutes);
app.use("/api/instituteAdmin", instituteAdminRoute);
app.use("/api/parent", parentRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/teacher", teacherRoutes);
app.use("/api/superAdmin", superAdmin);
app.use("/api/class", classRoutes);
app.use("/api/common", commonRoutes);

export default app;
