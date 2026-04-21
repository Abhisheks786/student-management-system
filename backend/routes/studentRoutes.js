import express from "express";
import { getMyAttendance } from "../controllers/studentController.js";
import { authorizeRoles, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect, authorizeRoles("Student"));
router.get("/attendance", getMyAttendance);

export default router;
