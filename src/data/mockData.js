// Frontend-only constants and pure helpers. Actual data (problems,
// announcements, users, volunteers) now lives in the backend (see server/)
// and is fetched via the Context providers in src/context.

export const PRIORITY_OPTIONS = ["Critical", "Medium", "Low"];
export const STATUS_OPTIONS = [
  "New",
  "Verified",
  "In Progress",
  "Waiting for Funds",
  "Completed",
  "Rejected",
];
export const CATEGORY_OPTIONS = [
  "Roads & Transport",
  "Water Supply",
  "Electricity",
  "Sanitation & Waste",
  "Drainage",
  "Public Health",
  "Education",
  "Street Lighting",
];

// Must match server/src/constants.js SECURITY_QUESTION_OPTIONS exactly — ids
// are validated server-side, display text lives in src/i18n as "secq.<id>".
export const SECURITY_QUESTION_OPTIONS = [
  "first-pet",
  "childhood-nickname",
  "favorite-teacher",
  "first-school",
  "childhood-place",
];

export const getProblemsByMandal = (problems, mandalId) =>
  problems.filter((p) => p.mandalId === mandalId);

export const getProblemStats = (problems) => {
  const total = problems.length;
  const resolved = problems.filter((p) => p.status === "Completed").length;
  const critical = problems.filter((p) => p.priority === "Critical" && p.status !== "Completed").length;
  const pending = problems.filter((p) => !["Completed", "Rejected"].includes(p.status)).length;
  const completionRate = total ? Math.round((resolved / total) * 100) : 0;
  return { total, resolved, critical, pending, completionRate };
};

// A mandal's "health" color is driven by open critical issues + completion rate.
export const getMandalHealth = (problems, mandalId) => {
  const mandalProblems = getProblemsByMandal(problems, mandalId);
  const { critical, completionRate } = getProblemStats(mandalProblems);
  if (critical >= 2) return "red";
  if (critical === 1 || completionRate < 30) return "yellow";
  return "green";
};

export const CONTACT_EMAIL = "manaavanigaddaofficial@gmail.com";

// Mock aggregate — real citizen count would come from the user database.
export const REGISTERED_CITIZENS = 12480;
