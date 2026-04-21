import Attendance from "../models/Attendance.js";
import User from "../models/User.js";

export const getAssignedStudents = async (_req, res) => {
  try {
    const students = await User.find({ role: "Student" })
      .select("-password")
      .sort({ name: 1 });
    return res.status(200).json(students);
  } catch (error) {
    return res.status(500).json({ message: "Unable to fetch students", error: error.message });
  }
};

export const markAttendance = async (req, res) => {
  const { records, date } = req.body;
  const attendanceDate = date || new Date().toISOString().slice(0, 10);

  if (!Array.isArray(records) || records.length === 0) {
    return res.status(400).json({ message: "records array is required" });
  }

  try {
    const operations = records.map((record) => ({
      updateOne: {
        filter: { studentId: record.studentId, date: attendanceDate },
        update: {
          $set: {
            status: record.status
          }
        },
        upsert: true
      }
    }));

    await Attendance.bulkWrite(operations);
    return res.status(200).json({ message: "Attendance saved", date: attendanceDate });
  } catch (error) {
    return res.status(500).json({ message: "Unable to mark attendance", error: error.message });
  }
};
