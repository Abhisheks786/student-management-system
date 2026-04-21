import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Attendance from "../models/Attendance.js";

export const getUsers = async (req, res) => {
  const role = req.query.role;
  const filter = role ? { role } : { role: { $in: ["Teacher", "Student"] } };

  try {
    const users = await User.find(filter).select("-password").sort({ createdAt: -1 });
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: "Unable to fetch users", error: error.message });
  }
};

export const createUser = async (req, res) => {
  const { name, email, password, role, enrollmentNumber } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: "name, email, password and role are required" });
  }

  if (!["Teacher", "Student"].includes(role)) {
    return res.status(400).json({ message: "Admin can only create Teacher or Student users" });
  }

  if (role === "Student" && !enrollmentNumber) {
    return res.status(400).json({ message: "enrollmentNumber is required for Student" });
  }

  try {
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role,
      enrollmentNumber: role === "Student" ? enrollmentNumber.trim() : null
    });

    return res.status(201).json({
      message: "User created successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        enrollmentNumber: user.enrollmentNumber
      }
    });
  } catch (error) {
    return res.status(500).json({ message: "Unable to create user", error: error.message });
  }
};

export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, password, role, enrollmentNumber } = req.body;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (role && !["Teacher", "Student"].includes(role)) {
      return res.status(400).json({ message: "Admin can only maintain Teacher or Student users" });
    }

    if (name) user.name = name.trim();
    if (email) user.email = email.toLowerCase().trim();
    if (role) user.role = role;
    if (typeof enrollmentNumber !== "undefined") {
      user.enrollmentNumber = enrollmentNumber ? enrollmentNumber.trim() : null;
    }
    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    if (user.role === "Student" && !user.enrollmentNumber) {
      return res.status(400).json({ message: "Student must have an enrollment number" });
    }

    const updatedUser = await user.save();
    return res.status(200).json({
      message: "User updated successfully",
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        enrollmentNumber: updatedUser.enrollmentNumber
      }
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "Email already exists" });
    }
    return res.status(500).json({ message: "Unable to update user", error: error.message });
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role === "Admin") {
      return res.status(400).json({ message: "Admin user cannot be deleted" });
    }

    await Attendance.deleteMany({ studentId: user._id });
    await user.deleteOne();

    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Unable to delete user", error: error.message });
  }
};
