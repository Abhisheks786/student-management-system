import { CheckCircle2, Save, UserCheck, XCircle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";
import { apiRequest } from "../services/api";

const TeacherDashboard = () => {
  const { token } = useAuth();
  const [students, setStudents] = useState([]);
  const [attendanceMap, setAttendanceMap] = useState({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const data = await apiRequest("/teacher/students", { token });
        setStudents(data);
        const initial = data.reduce((acc, student) => {
          acc[student._id] = "Present";
          return acc;
        }, {});
        setAttendanceMap(initial);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchStudents();
  }, []);

  const saveAttendance = async () => {
    try {
      setSaving(true);
      await apiRequest("/teacher/attendance", {
        method: "POST",
        token,
        body: JSON.stringify({
          date: today,
          records: students.map((student) => ({
            studentId: student._id,
            status: attendanceMap[student._id] || "Present"
          }))
        })
      });
      setError("");
      alert("Attendance saved successfully.");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="grid min-h-screen grid-cols-1 bg-slate-100 md:grid-cols-[260px_1fr]">
      <Sidebar />
      <main className="p-4 md:p-8">
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Teacher Dashboard</h1>
            <p className="text-slate-500">Mark today's attendance for all assigned students.</p>
          </div>
          <span className="rounded-full bg-white px-3 py-1 text-sm font-medium text-slate-600 shadow">
            Date: {today}
          </span>
        </div>

        {error ? <p className="mb-4 rounded-lg bg-red-50 p-3 text-red-600">{error}</p> : null}

        <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:p-6">
          <div className="mb-4 flex items-center gap-2">
            <UserCheck size={18} className="text-brand-500" />
            <h2 className="font-semibold text-slate-900">Student Attendance</h2>
          </div>

          <div className="space-y-3">
            {students.map((student) => {
              const status = attendanceMap[student._id];
              return (
                <div
                  key={student._id}
                  className="flex flex-col justify-between gap-3 rounded-xl border border-slate-200 p-4 sm:flex-row sm:items-center"
                >
                  <div>
                    <p className="font-semibold text-slate-800">{student.name}</p>
                    <p className="text-sm text-slate-500">{student.enrollmentNumber}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setAttendanceMap((prev) => ({ ...prev, [student._id]: "Present" }))
                      }
                      className={`inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-semibold transition ${
                        status === "Present"
                          ? "bg-emerald-500 text-white"
                          : "border border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                      }`}
                    >
                      <CheckCircle2 size={14} />
                      Present
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setAttendanceMap((prev) => ({ ...prev, [student._id]: "Absent" }))
                      }
                      className={`inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-semibold transition ${
                        status === "Absent"
                          ? "bg-red-500 text-white"
                          : "border border-red-200 text-red-600 hover:bg-red-50"
                      }`}
                    >
                      <XCircle size={14} />
                      Absent
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            type="button"
            onClick={saveAttendance}
            disabled={saving}
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            <Save size={16} />
            {saving ? "Saving..." : "Save Attendance"}
          </button>
        </section>
      </main>
    </div>
  );
};

export default TeacherDashboard;
