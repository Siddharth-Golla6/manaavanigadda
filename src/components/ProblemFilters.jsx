import React from "react";
import { Search } from "lucide-react";
import { Input, Select } from "./FormField";
import { MANDALS, getVillagesForMandal } from "../data/geography";
import { CATEGORY_OPTIONS, PRIORITY_OPTIONS, STATUS_OPTIONS } from "../data/mockData";

export const DEFAULT_FILTERS = {
  q: "",
  mandalId: "",
  village: "",
  category: "",
  priority: "",
  status: "",
};

export default function ProblemFilters({ filters, onChange }) {
  const set = (key, value) => {
    const next = { ...filters, [key]: value };
    if (key === "mandalId") next.village = "";
    onChange(next);
  };

  const villages = filters.mandalId ? getVillagesForMandal(filters.mandalId) : [];

  return (
    <div className="glass-card grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 lg:grid-cols-6">
      <div className="relative lg:col-span-2">
        <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
        <Input
          placeholder="Search title, complaint ID, citizen name…"
          value={filters.q}
          onChange={(e) => set("q", e.target.value)}
          className="pl-9"
          aria-label="Search complaints"
        />
      </div>

      <Select value={filters.mandalId} onChange={(e) => set("mandalId", e.target.value)} aria-label="Filter by Mandal">
        <option value="">All Mandals</option>
        {MANDALS.map((m) => (
          <option key={m.id} value={m.id}>{m.name}</option>
        ))}
      </Select>

      <Select
        value={filters.village}
        onChange={(e) => set("village", e.target.value)}
        disabled={!filters.mandalId}
        aria-label="Filter by Village"
      >
        <option value="">All Villages</option>
        {villages.map((v) => (
          <option key={v} value={v}>{v}</option>
        ))}
      </Select>

      <Select value={filters.category} onChange={(e) => set("category", e.target.value)} aria-label="Filter by Category">
        <option value="">All Categories</option>
        {CATEGORY_OPTIONS.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </Select>

      <Select value={filters.priority} onChange={(e) => set("priority", e.target.value)} aria-label="Filter by Priority">
        <option value="">All Priorities</option>
        {PRIORITY_OPTIONS.map((p) => (
          <option key={p} value={p}>{p}</option>
        ))}
      </Select>

      <Select value={filters.status} onChange={(e) => set("status", e.target.value)} aria-label="Filter by Status">
        <option value="">All Statuses</option>
        {STATUS_OPTIONS.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </Select>
    </div>
  );
}

export function applyFilters(problems, filters) {
  const q = filters.q.trim().toLowerCase();
  return problems.filter((p) => {
    if (filters.mandalId && p.mandalId !== filters.mandalId) return false;
    if (filters.village && p.village !== filters.village) return false;
    if (filters.category && p.category !== filters.category) return false;
    if (filters.priority && p.priority !== filters.priority) return false;
    if (filters.status && p.status !== filters.status) return false;
    if (
      q &&
      !`${p.title} ${p.id} ${p.reportedBy} ${p.village}`.toLowerCase().includes(q)
    )
      return false;
    return true;
  });
}
