import React, { useState } from "react";
import {
  LayoutDashboard, ClipboardList, Megaphone,
  Users, Map, History, FileDown, BarChart3,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useProblems } from "../context/ProblemsContext";
import { downloadCsv } from "../utils/exportData";

import AnalyticsPanel from "./admin/AnalyticsPanel";
import ComplaintsPanel from "./admin/ComplaintsPanel";
import AnnouncementsPanel from "./admin/AnnouncementsPanel";
import UsersPanel from "./admin/UsersPanel";
import GeographyPanel from "./admin/GeographyPanel";
import ActivityLogPanel from "./admin/ActivityLogPanel";

const TABS = [
  { key: "analytics", label: "Analytics", icon: BarChart3 },
  { key: "complaints", label: "Complaints", icon: ClipboardList },
  { key: "announcements", label: "Announcements", icon: Megaphone },
  { key: "users", label: "Users", icon: Users },
  { key: "geography", label: "Mandals & Villages", icon: Map },
  { key: "reports", label: "Reports & Export", icon: FileDown },
  { key: "logs", label: "Activity Logs", icon: History },
];

export default function AdminDashboard() {
  const { user } = useAuth();
  const { problems } = useProblems();
  const [tab, setTab] = useState("analytics");

  const exportProblems = () =>
    downloadCsv(
      "mana-avanigadda-complaints.csv",
      problems.map((p) => ({
        ID: p.id,
        Title: p.title,
        Category: p.category,
        Mandal: p.mandalName,
        Village: p.village,
        Status: p.status,
        Priority: p.priority,
        ReportedAt: new Date(p.reportedAt).toLocaleDateString("en-IN"),
      }))
    );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="flex items-center gap-2 text-sm font-semibold text-brand-red">
            <LayoutDashboard size={16} /> Admin Dashboard
          </p>
          <h1 className="text-2xl font-extrabold text-neutral-900 dark:text-white sm:text-3xl">
            Welcome, {user?.name} <span className="text-sm font-medium text-neutral-400">({user?.role})</span>
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[220px_1fr]">
        <nav className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible" aria-label="Admin sections">
          {TABS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-semibold transition ${
                tab === key
                  ? "bg-brand-red text-white"
                  : "text-neutral-600 hover:bg-brand-yellow/15 dark:text-neutral-300"
              }`}
            >
              <Icon size={16} /> {label}
            </button>
          ))}
        </nav>

        <div className="min-w-0">
          {tab === "analytics" && <AnalyticsPanel />}
          {tab === "complaints" && <ComplaintsPanel />}
          {tab === "announcements" && <AnnouncementsPanel />}
          {tab === "users" && <UsersPanel />}
          {tab === "geography" && <GeographyPanel />}
          {tab === "logs" && <ActivityLogPanel />}
          {tab === "reports" && (
            <div>
              <h2 className="mb-4 text-lg font-bold text-neutral-900 dark:text-white">Reports & Export</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <button
                  onClick={exportProblems}
                  className="glass-card p-5 text-left transition hover:-translate-y-1"
                >
                  <FileDown size={20} className="mb-2 text-brand-red" />
                  <p className="font-bold text-neutral-900 dark:text-white">Complaints Export (CSV)</p>
                  <p className="text-xs text-neutral-500">{problems.length} records — opens in Excel/Sheets</p>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
