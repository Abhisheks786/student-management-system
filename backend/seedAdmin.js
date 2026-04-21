import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import User from "./models/User.js";

dotenv.config();

const seedAdmin = async () => {
  try {
    await connectDB();

    const email = "admin@sms.com";
    const existingAdmin = await User.findOne({ email });
    if (existingAdmin) {
      console.log("Admin already exists.");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash("admin123", 10);
    await User.create({
      name: "System Admin",
      email,
      password: hashedPassword,
      role: "Admin"
    });

    console.log("Admin seeded successfully. Email: admin@sms.com Password: admin123");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error.message);
    process.exit(1);
  }
};

seedAdmin();
