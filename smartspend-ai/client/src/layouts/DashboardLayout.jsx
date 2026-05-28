import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  FiBarChart2,
  FiCamera,
  FiFileText,
  FiGrid,
  FiLogOut,
  FiMenu,
  FiMoon,
  FiSun,
  FiUpload,
  FiX
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

const links = [
  { to: "/", label: "Overview", icon: FiGrid },
  { to: "/transactions", label: "Transactions", icon: FiFileText },
  { to: "/import", label: "CSV Import", icon: FiUpload },
  { to: "/scanner", label: "Receipt Scan", icon: FiCamera },
  { to: "/insights", label: "Insights", icon: FiBarChart2 }
];

const Sidebar = ({ onNavigate }) => {
  const { user } = useAuth();

  return (
    <aside className="flex h-full flex-col">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-600 font-bold text-white">
          S
        </div>
        <div>
          <h1 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100">SmartSpend</h1>
          <p className="text-xs text-slate-500">Student expense tracker</p>
        </div>
      </div>

      <nav className="space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              onClick={onNavigate}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                    : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                }`
              }
            >
              <Icon className="h-4 w-4" />
              {link.label}
            </NavLink>
          );
        })}
      </nav>

      <div className="mt-auto rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
        <p className="text-xs font-medium uppercase text-slate-500">Account</p>
        <p className="mt-2 truncate text-sm font-semibold">{user?.name || "SmartSpend user"}</p>
        <p className="truncate text-xs text-slate-500">{user?.email}</p>
      </div>
    </aside>
  );
};

export default function DashboardLayout() {
  const { user, logout, toggleTheme } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="app-shell text-slate-900 dark:text-slate-100">
      <div className="fixed inset-y-0 left-0 z-30 hidden w-72 border-r border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 lg:block">
        <Sidebar />
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-slate-950/50 lg:hidden">
          <div className="h-full w-72 border-r border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <button className="btn-light mb-5" onClick={() => setMobileOpen(false)} aria-label="Close menu">
              <FiX />
            </button>
            <Sidebar onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      <main className="lg:pl-72">
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <button className="btn-light lg:hidden" onClick={() => setMobileOpen(true)} aria-label="Open menu">
                <FiMenu />
              </button>
              <div>
                <p className="text-xs text-slate-400">Welcome back</p>
                <h2 className="text-sm font-semibold sm:text-base">{user?.name || "Student"}</h2>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button className="btn-light" onClick={toggleTheme} title="Toggle theme">
                <FiMoon className="hidden dark:block" />
                <FiSun className="dark:hidden" />
              </button>
              <button className="btn-light" onClick={logout}>
                <FiLogOut />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
