import express from "express";
import { upload } from "../middleware/multer.middleware.js";
import {
  getMemberBykey,
  getRequest,
  aproveStudentRequest,
  loginUser,
  aproveTeacherRequest,
  aproveParentRequest,
  addFeesRecord,
  getStudentFeesRecords,
  updateFeesRecord,
  addPettyCash,
  getPettyCash,
  addLibraryBook,
  getLibraryBooks,
  addEvent,
  getEvents,
  addExpense,
  getExpenses,
  addTeacherSalary,
  updateTeacherSalary,
  getTeacherSalaries,
  getCurrentInstitute,
  updatePassword,
} from "../controller/instituteAdmin.controller.js";

const router = express.Router();

router.route("/login").post(loginUser);
router.route("/get-member-by-key").post(getMemberBykey);
router.route("/get-joining-request").post(getRequest);
router.route("/aprove-student-request").post(aproveStudentRequest);
router.route("/aprove-teacher-request").post(aproveTeacherRequest);
router.route("/aprove-parent-request").post(aproveParentRequest);
router.post("/fees-records", addFeesRecord);
router.get("/fees-records/student/:studentId", getStudentFeesRecords);
router.put("/fees-records/:feeRecordId", updateFeesRecord);

router.post("/:instituteAdminId/petty-cash", addPettyCash);
router.get("/:instituteAdminId/petty-cash", getPettyCash);

router.post("/:instituteAdminId/library", addLibraryBook);
router.get("/:instituteAdminId/library", getLibraryBooks);

router.post("/:instituteAdminId/events", addEvent);
router.get("/:instituteAdminId/events", getEvents);

router.post("/:instituteAdminId/expenses", addExpense);
router.get("/:instituteAdminId/expenses", getExpenses);

router.post("/:instituteAdminId/teacher-salaries", addTeacherSalary);
router.put(
  "/:instituteAdminId/teacher-salaries/:salaryId",
  updateTeacherSalary
);
router.get("/:instituteAdminId/teacher-salaries", getTeacherSalaries);

router.get("/get-current-institute/:instituteAdminId", getCurrentInstitute);

router.get("/update-password/:instituteAdminId", updatePassword);

export default router;
