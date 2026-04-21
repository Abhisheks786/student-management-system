import { GraduationCap, Lock, Mail } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      const user = await login(email, password);
      navigate(`/${user.role.toLowerCase()}`);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 via-brand-50 to-slate-100 p-5">
      <div className="w-full max-w-md rounded-2xl border border-white/40 bg-white/95 p-7 shadow-premium backdrop-blur">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-500 text-white">
            <GraduationCap size={22} />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Student Management System</h1>
          <p className="text-sm text-slate-500">Secure role-based login portal</p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <label className="block">
            <span className="mb-1 flex items-center gap-2 text-sm font-medium text-slate-700">
              <Mail size={15} /> Email
            </span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none transition focus:border-brand-500 focus:bg-white"
              placeholder="admin@sms.com"
            />
          </label>

          <label className="block">
            <span className="mb-1 flex items-center gap-2 text-sm font-medium text-slate-700">
              <Lock size={15} /> Password
            </span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none transition focus:border-brand-500 focus:bg-white"
              placeholder="Enter password"
            />
          </label>

          {error ? (
            <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-slate-900 px-4 py-2.5 font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
