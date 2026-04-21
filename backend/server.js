import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { connectDB } from "./config/db.js";
import adminRoutes from "./routes/adminRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import teacherRoutes from "./routes/teacherRoutes.js";

dotenv.config();
connectDB();

const app = express();

const allowedOriginsFromEnv = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
const defaultAllowedOrigins = ["https://delightful-paletas-2814b8.netlify.app"];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      const isAllowed =
        /^http:\/\/127\.0\.0\.1:\d+$/.test(origin) ||
        /^http:\/\/localhost:\d+$/.test(origin) ||
        defaultAllowedOrigins.includes(origin) ||
        allowedOriginsFromEnv.includes(origin);
      if (isAllowed) return callback(null, true);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true
  })
);
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.status(200).json({ message: "SMS backend is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/teacher", teacherRoutes);
app.use("/api/student", studentRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://127.0.0.1:${PORT}`);
});
