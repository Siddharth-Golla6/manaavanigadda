import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Trash2, MapPinned, Eye } from "lucide-react";
import GlassCard from "../../components/GlassCard";
import { Select } from "../../components/FormField";
import ProblemFilters, { DEFAULT_FILTERS, applyFilters } from "../../components/ProblemFilters";
import MapPicker from "../../components/MapPicker";
import { useProblems } from "../../context/ProblemsContext";
import { useActivityLog } from "../../context/ActivityLogContext";
import { useAuth } from "../../context/AuthContext";
import { PRIORITY_OPTIONS, STATUS_OPTIONS } from "../../data/mockData";

export default function ComplaintsPanel() {
  const { problems, updateProblem, deleteProblem } = useProblems();
  const { log } = useActivityLog();
  const { user } = useAuth();
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [mapFor, setMapFor] = useState(null);

  const filtered = useMemo(() => applyFilters(problems, filters), [problems, filters]);
  const [error, setError] = useState("");

  const handleStatus = async (p, status) => {
    setError("");
    try {
      await updateProblem(p.id, { status });
      await log(user?.name || "Admin", `Changed status of "${p.title}" to ${status}`);
    } catch (err) {
      setError(err.message);
    }
  };

  const handlePriority = async (p, priority) => {
    setError("");
    try {
      await updateProblem(p.id, { priority });
      await log(user?.name || "Admin", `Set priority of "${p.title}" to ${priority}`);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (p) => {
    if (!window.confirm(`Delete complaint "${p.title}"? This cannot be undone.`)) return;
    setError("");
    try {
      await deleteProblem(p.id);
      await log(user?.name || "Admin", `Deleted complaint "${p.title}"`);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h2 className="mb-4 text-lg font-bold text-neutral-900 dark:text-white">Complaint Verification & Management</h2>
      <div className="mb-4">
        <ProblemFilters filters={filters} onChange={setFilters} />
      </div>
      {error && <p className="mb-3 text-sm font-medium text-brand-red">{error}</p>}

      <GlassCard className="overflow-x-auto !p-0">
        <table className="w-full min-w-[900px] text-sm">
          <thead>
            <tr className="border-b border-neutral-200 text-left text-xs uppercase text-neutral-400 dark:border-neutral-800">
              <th className="px-4 py-3">Complaint</th>
              <th className="px-4 py-3">Location</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Priority</th>
              <th className="px-4 py-3">Support</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
            {filtered.map((p) => (
              <tr key={p.id}>
                <td className="max-w-[220px] px-4 py-3">
                  <p className="truncate font-semibold text-neutral-800 dark:text-neutral-100">{p.title}</p>
                  <p className="text-xs text-neutral-400">#{p.id} · {p.category}</p>
                </td>
                <td className="px-4 py-3 text-neutral-500">{p.village}, <br />{p.mandalName}</td>
                <td className="px-4 py-3">
                  <Select value={p.status} onChange={(e) => handleStatus(p, e.target.value)} className="!py-1.5 text-xs">
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </Select>
                </td>
                <td className="px-4 py-3">
                  <Select value={p.priority} onChange={(e) => handlePriority(p, e.target.value)} className="!py-1.5 text-xs">
                    {PRIORITY_OPTIONS.map((pr) => (
                      <option key={pr} value={pr}>{pr}</option>
                    ))}
                  </Select>
                </td>
                <td className="px-4 py-3 text-neutral-500">{p.supportCount}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Link to={`/problem/${p.id}`} className="rounded-lg p-1.5 text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800" title="View">
                      <Eye size={16} />
                    </Link>
                    {p.lat && (
                      <button onClick={() => setMapFor(mapFor === p.id ? null : p.id)} className="rounded-lg p-1.5 text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800" title="GPS location">
                        <MapPinned size={16} />
                      </button>
                    )}
                    <button onClick={() => handleDelete(p)} className="rounded-lg p-1.5 text-brand-red hover:bg-red-50 dark:hover:bg-red-500/10" title="Delete">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {mapFor && (
          <div className="border-t border-neutral-200 p-4 dark:border-neutral-800">
            {(() => {
              const p = filtered.find((x) => x.id === mapFor);
              return p ? <MapPicker value={{ lat: p.lat, lng: p.lng }} readOnly onChange={() => {}} /> : null;
            })()}
          </div>
        )}

        {filtered.length === 0 && (
          <p className="p-8 text-center text-neutral-400">No complaints match these filters.</p>
        )}
      </GlassCard>
    </div>
  );
}
