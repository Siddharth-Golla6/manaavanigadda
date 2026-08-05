import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, LogIn, Menu, X } from "lucide-react";

const DASHBOARD_LINKS = [
  { to: "/dashboard", label: "Community Dashboard" },
  { to: "/solved", label: "Solved Problems" },
];

export default function LandingNavbar() {
  const [dashboardsOpen, setDashboardsOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="relative z-20 bg-brand-cream dark:bg-neutral-950">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-5">
        <Link to="/" className="flex shrink-0 items-center gap-2.5">
          <div className="leading-tight">
            <p className="text-lg font-extrabold tracking-tight text-neutral-900 dark:text-white">Mana Avanigadda</p>
            <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">One Community, One Vision.</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary">
          <Link to="/dashboard" className="text-[15px] font-semibold text-neutral-800 transition hover:text-brand-green dark:text-neutral-200 dark:hover:text-brand-yellow">
            Problems
          </Link>
          <Link to="/announcements" className="text-[15px] font-semibold text-neutral-800 transition hover:text-brand-green dark:text-neutral-200 dark:hover:text-brand-yellow">
            Announcements
          </Link>

          <div
            className="relative"
            onMouseEnter={() => setDashboardsOpen(true)}
            onMouseLeave={() => setDashboardsOpen(false)}
          >
            <button
              type="button"
              onClick={() => setDashboardsOpen((o) => !o)}
              aria-expanded={dashboardsOpen}
              aria-haspopup="true"
              className="flex items-center gap-1 text-[15px] font-semibold text-neutral-800 transition hover:text-brand-green dark:text-neutral-200 dark:hover:text-brand-yellow"
            >
              Dashboards
              <ChevronDown size={16} className={`transition-transform ${dashboardsOpen ? "rotate-180" : ""}`} />
            </button>

            {dashboardsOpen && (
              <div className="absolute left-1/2 top-full z-30 mt-2 w-64 -translate-x-1/2 overflow-hidden rounded-xl border border-neutral-200 bg-white py-2 shadow-xl dark:border-neutral-800 dark:bg-neutral-900">
                {DASHBOARD_LINKS.map((l) => (
                  <Link
                    key={l.to}
                    to={l.to}
                    className="block px-4 py-2.5 text-sm font-medium text-neutral-700 transition hover:bg-brand-yellow/15 hover:text-brand-green dark:text-neutral-200 dark:hover:bg-neutral-800"
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>

        <Link
          to="/login"
          className="hidden shrink-0 items-center gap-2 rounded-full bg-brand-yellow px-5 py-2.5 text-sm font-bold text-neutral-900 shadow-md transition hover:-translate-y-0.5 hover:bg-brand-yellow-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-green focus-visible:ring-offset-2 focus-visible:ring-offset-brand-cream lg:inline-flex"
        >
          <LogIn size={16} /> Login
        </Link>

        <button
          type="button"
          onClick={() => setMobileOpen((o) => !o)}
          aria-label="Toggle menu"
          className="rounded-lg p-2 text-neutral-800 dark:text-neutral-200 lg:hidden"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {mobileOpen && (
        <nav
          aria-label="Mobile primary"
          className="border-t border-neutral-200 bg-brand-cream px-6 py-4 dark:border-neutral-800 dark:bg-neutral-950 lg:hidden"
        >
          <div className="flex flex-col gap-1">
            <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-semibold text-neutral-800 hover:bg-brand-yellow/15 dark:text-neutral-200">
              Problems
            </Link>
            <Link to="/announcements" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-semibold text-neutral-800 hover:bg-brand-yellow/15 dark:text-neutral-200">
              Announcements
            </Link>
            <p className="mt-2 px-3 text-xs font-bold uppercase tracking-wide text-neutral-400">Dashboards</p>
            {DASHBOARD_LINKS.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-semibold text-neutral-800 hover:bg-brand-yellow/15 dark:text-neutral-200"
              >
                {l.label}
              </Link>
            ))}
            <Link
              to="/login"
              onClick={() => setMobileOpen(false)}
              className="mt-3 inline-flex items-center justify-center gap-2 rounded-full bg-brand-yellow px-5 py-2.5 text-sm font-bold text-neutral-900 shadow-md"
            >
              <LogIn size={16} /> Login
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
