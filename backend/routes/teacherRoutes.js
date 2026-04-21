import express from "express";
import { getAssignedStudents, markAttendance } from "../controllers/teacherController.js";
import { authorizeRoles, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect, authorizeRoles("Teacher"));
router.get("/students", getAssignedStudents);
router.post("/attendance", markAttendance);

export default router;
