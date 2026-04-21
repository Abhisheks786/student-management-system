import Attendance from "../models/Attendance.js";

export const getMyAttendance = async (req, res) => {
  try {
    const records = await Attendance.find({ studentId: req.user._id }).sort({ date: -1 });
    const total = records.length;
    const present = records.filter((entry) => entry.status === "Present").length;
    const percentage = total ? Math.round((present / total) * 100) : 0;

    return res.status(200).json({
      stats: {
        total,
        present,
        absent: total - present,
        percentage
      },
      records
    });
  } catch (error) {
    return res.status(500).json({ message: "Unable to fetch attendance", error: error.message });
  }
};
