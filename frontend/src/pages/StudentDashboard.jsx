import { CalendarDays, ChartNoAxesColumnIncreasing, GraduationCap } from "lucide-react";
import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";
import { apiRequest } from "../services/api";

const StudentDashboard = () => {
  const { token, user } = useAuth();
  const [stats, setStats] = useState({ total: 0, present: 0, absent: 0, percentage: 0 });
  const [records, setRecords] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadAttendance = async () => {
      try {
        const data = await apiRequest("/student/attendance", { token });
        setStats(data.stats);
        setRecords(data.records);
      } catch (err) {
        setError(err.message);
      }
    };
    loadAttendance();
  }, []);

  return (
    <div className="grid min-h-screen grid-cols-1 bg-slate-100 md:grid-cols-[260px_1fr]">
      <Sidebar />
      <main className="p-4 md:p-8">
        <h1 className="mb-6 text-2xl font-bold text-slate-900">Student Dashboard</h1>
        {error ? <p className="mb-4 rounded-lg bg-red-50 p-3 text-red-600">{error}</p> : null}

        <section className="mb-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center gap-2">
              <GraduationCap size={18} className="text-brand-500" />
              <h2 className="font-semibold text-slate-900">Profile</h2>
            </div>
            <p className="text-sm text-slate-500">Name</p>
            <p className="mb-2 font-semibold text-slate-800">{user?.name}</p>
            <p className="text-sm text-slate-500">Email</p>
            <p className="mb-2 font-semibold text-slate-800">{user?.email}</p>
            <p className="text-sm text-slate-500">Enrollment Number</p>
            <p className="font-semibold text-slate-800">{user?.enrollmentNumber || "-"}</p>
          </div>

          <div className="rounded-xl border border-brand-100 bg-gradient-to-br from-brand-50 to-white p-5 shadow-sm">
            <div className="mb-3 flex items-center gap-2">
              <ChartNoAxesColumnIncreasing size={18} className="text-brand-500" />
              <h2 className="font-semibold text-slate-900">Attendance Snapshot</h2>
            </div>
            <p className="text-4xl font-bold text-brand-700">{stats.percentage}%</p>
            <p className="mt-2 text-sm text-slate-600">
              Present {stats.present} / {stats.total} classes
            </p>
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <CalendarDays size={18} className="text-brand-500" />
            <h2 className="font-semibold text-slate-900">Attendance History</h2>
          </div>

          <div className="space-y-2">
            {records.map((record) => (
              <div
                key={record._id}
                className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 p-3"
              >
                <span className="text-sm font-medium text-slate-700">{record.date}</span>
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                    record.status === "Present"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {record.status}
                </span>
              </div>
            ))}
            {records.length === 0 ? <p className="text-sm text-slate-500">No attendance records yet.</p> : null}
          </div>
        </section>
      </main>
    </div>
  );
};

export default StudentDashboard;
