import { Plus, Trash2, Users2 } from "lucide-react";
import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";
import { apiRequest } from "../services/api";

const initialForm = {
  name: "",
  email: "",
  password: "",
  role: "Student",
  enrollmentNumber: ""
};

const AdminDashboard = () => {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(initialForm);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await apiRequest("/admin/users", { token });
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleCreate = async (event) => {
    event.preventDefault();
    try {
      await apiRequest("/admin/users", {
        method: "POST",
        token,
        body: JSON.stringify(form)
      });
      setForm(initialForm);
      setShowModal(false);
      loadUsers();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      await apiRequest(`/admin/users/${id}`, { method: "DELETE", token });
      loadUsers();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="grid min-h-screen grid-cols-1 bg-slate-100 md:grid-cols-[260px_1fr]">
      <Sidebar />
      <main className="p-4 md:p-8">
        <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
            <p className="text-slate-500">Manage teachers and students from one workspace.</p>
          </div>
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 font-semibold text-white transition hover:bg-brand-700"
          >
            <Plus size={16} />
            Add User
          </button>
        </header>

        <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:p-6">
          <div className="mb-4 flex items-center gap-2">
            <Users2 size={18} className="text-brand-500" />
            <h2 className="font-semibold text-slate-900">User Directory</h2>
          </div>

          {error ? <p className="mb-4 rounded-lg bg-red-50 p-3 text-red-600">{error}</p> : null}
          {loading ? <p className="text-slate-500">Loading users...</p> : null}

          {!loading && (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-left text-slate-500">
                    <th className="px-3 py-3">Name</th>
                    <th className="px-3 py-3">Email</th>
                    <th className="px-3 py-3">Role</th>
                    <th className="px-3 py-3">Enrollment</th>
                    <th className="px-3 py-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id} className="border-b border-slate-100">
                      <td className="px-3 py-3 font-medium text-slate-800">{user.name}</td>
                      <td className="px-3 py-3 text-slate-600">{user.email}</td>
                      <td className="px-3 py-3">
                        <span className="rounded-full bg-brand-50 px-2 py-1 text-xs font-semibold text-brand-700">
                          {user.role}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-slate-600">{user.enrollmentNumber || "-"}</td>
                      <td className="px-3 py-3">
                        <button
                          type="button"
                          onClick={() => handleDelete(user._id)}
                          className="inline-flex items-center gap-1 rounded-md border border-red-200 px-2.5 py-1.5 text-red-600 transition hover:bg-red-50"
                        >
                          <Trash2 size={14} />
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {showModal ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 p-4">
            <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-premium">
              <h3 className="mb-4 text-lg font-bold text-slate-900">Add New User</h3>
              <form className="space-y-3" onSubmit={handleCreate}>
                <input
                  className="w-full rounded-lg border border-slate-200 px-3 py-2"
                  placeholder="Full name"
                  required
                  value={form.name}
                  onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                />
                <input
                  className="w-full rounded-lg border border-slate-200 px-3 py-2"
                  placeholder="Email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                />
                <input
                  className="w-full rounded-lg border border-slate-200 px-3 py-2"
                  placeholder="Password"
                  type="password"
                  required
                  value={form.password}
                  onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
                />
                <select
                  className="w-full rounded-lg border border-slate-200 px-3 py-2"
                  value={form.role}
                  onChange={(e) => setForm((prev) => ({ ...prev, role: e.target.value }))}
                >
                  <option value="Student">Student</option>
                  <option value="Teacher">Teacher</option>
                </select>

                {form.role === "Student" && (
                  <input
                    className="w-full rounded-lg border border-slate-200 px-3 py-2"
                    placeholder="Enrollment number"
                    required
                    value={form.enrollmentNumber}
                    onChange={(e) => setForm((prev) => ({ ...prev, enrollmentNumber: e.target.value }))}
                  />
                )}

                <div className="mt-4 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="rounded-lg border border-slate-200 px-4 py-2"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="rounded-lg bg-brand-500 px-4 py-2 text-white">
                    Create User
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
};

export default AdminDashboard;
