import { LayoutDashboard, LogOut, ShieldCheck, Users, UserSquare2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const menuByRole = {
  Admin: [{ label: "Dashboard", icon: LayoutDashboard }],
  Teacher: [{ label: "My Students", icon: Users }],
  Student: [{ label: "My Attendance", icon: UserSquare2 }]
};

const roleIcon = {
  Admin: ShieldCheck,
  Teacher: Users,
  Student: UserSquare2
};

const Sidebar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const RoleIcon = roleIcon[user.role];
  const items = menuByRole[user.role] || [];

  return (
    <aside className="flex h-full w-full flex-col border-r border-slate-200 bg-white p-4">
      <div className="mb-8 flex items-center gap-3 rounded-xl bg-brand-50 p-3">
        <div className="rounded-lg bg-brand-500 p-2 text-white">
          <RoleIcon size={18} />
        </div>
        <div>
          <p className="text-sm text-slate-500">Signed in as</p>
          <p className="font-semibold text-slate-900">{user.name}</p>
        </div>
      </div>

      <nav className="space-y-2">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              type="button"
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            >
              <Icon size={16} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <button
        type="button"
        onClick={() => {
          logout();
          navigate("/");
        }}
        className="mt-auto flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
      >
        <LogOut size={16} />
        Logout
      </button>
    </aside>
  );
};

export default Sidebar;
