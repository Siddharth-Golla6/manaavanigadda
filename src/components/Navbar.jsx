import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Menu, X, Sun, Moon, LogOut, ShieldCheck, User } from "lucide-react";
import Logo from "./Logo";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const LINKS = [
  { to: "/dashboard", label: "Home" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/report", label: "Report Problem" },
  { to: "/solved", label: "Solved Problems" },
  { to: "/announcements", label: "Announcements" },
  { to: "/about", label: "About Us" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, isAdmin, logout } = useAuth();
  const { dark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate("/");
  };

  const linkClass = ({ isActive }) =>
    `rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
      isActive
        ? "bg-brand-red text-white"
        : "text-neutral-700 hover:bg-brand-yellow/20 dark:text-neutral-200"
    }`;

  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200/70 bg-white/80 backdrop-blur-md dark:border-neutral-800 dark:bg-neutral-950/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-2.5 sm:px-6">
        <NavLink to="/" className="shrink-0">
          <Logo size={38} />
        </NavLink>

        <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Primary">
          {LINKS.filter((l, i) => LINKS.findIndex((x) => x.label === l.label) === i).map((link) => (
            <NavLink key={link.label} to={link.to} className={linkClass}>
              {link.label}
            </NavLink>
          ))}
          {isAdmin && (
            <NavLink to="/admin" className={linkClass}>
              Admin Dashboard
            </NavLink>
          )}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <button
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
            className="rounded-full p-2 text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
          >
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          {user ? (
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 rounded-full bg-brand-yellow/20 px-3 py-1.5 text-xs font-semibold text-neutral-800 dark:text-brand-yellow">
                {isAdmin ? <ShieldCheck size={14} /> : <User size={14} />}
                {user.name}
              </span>
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-1 rounded-lg border border-neutral-300 px-3 py-1.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-800"
              >
                <LogOut size={14} /> Logout
              </button>
            </div>
          ) : (
            <NavLink
              to="/login"
              className="rounded-lg bg-brand-red px-4 py-2 text-sm font-semibold text-white hover:bg-brand-red-dark"
            >
              Login
            </NavLink>
          )}
        </div>

        <button
          className="rounded-lg p-2 text-neutral-700 dark:text-neutral-200 lg:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-neutral-200 bg-white px-4 py-3 dark:border-neutral-800 dark:bg-neutral-950 lg:hidden">
          <nav className="flex flex-col gap-1" aria-label="Mobile">
            {LINKS.filter((l, i) => LINKS.findIndex((x) => x.label === l.label) === i).map((link) => (
              <NavLink key={link.label} to={link.to} className={linkClass} onClick={() => setOpen(false)}>
                {link.label}
              </NavLink>
            ))}
            {isAdmin && (
              <NavLink to="/admin" className={linkClass} onClick={() => setOpen(false)}>
                Admin Dashboard
              </NavLink>
            )}
            <div className="mt-2 flex items-center justify-between border-t border-neutral-200 pt-3 dark:border-neutral-800">
              <button
                onClick={toggleTheme}
                className="flex items-center gap-2 text-sm font-semibold text-neutral-700 dark:text-neutral-200"
              >
                {dark ? <Sun size={16} /> : <Moon size={16} />} {dark ? "Light" : "Dark"} mode
              </button>
              {user ? (
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-1 rounded-lg border border-neutral-300 px-3 py-1.5 text-xs font-semibold text-neutral-700 dark:border-neutral-700 dark:text-neutral-200"
                >
                  <LogOut size={14} /> Logout
                </button>
              ) : (
                <NavLink
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="rounded-lg bg-brand-red px-4 py-2 text-sm font-semibold text-white"
                >
                  Login
                </NavLink>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
