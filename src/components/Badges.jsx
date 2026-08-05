import React from "react";

export const STATUS_STYLES = {
  New: "bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300",
  Verified: "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300",
  "In Progress": "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  "Waiting for Funds": "bg-purple-100 text-purple-700 dark:bg-purple-500/15 dark:text-purple-300",
  Completed: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
  Rejected: "bg-neutral-200 text-neutral-600 dark:bg-neutral-700 dark:text-neutral-300",
};

export const PRIORITY_STYLES = {
  Critical: "bg-brand-red text-white",
  Medium: "bg-brand-yellow text-neutral-900",
  Low: "bg-neutral-200 text-neutral-700 dark:bg-neutral-700 dark:text-neutral-200",
};

export function StatusBadge({ status }) {
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${STATUS_STYLES[status] || ""}`}>
      {status}
    </span>
  );
}

export function PriorityBadge({ priority }) {
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${PRIORITY_STYLES[priority] || ""}`}>
      {priority}
    </span>
  );
}
