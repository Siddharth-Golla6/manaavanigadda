import React, { useMemo } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { MapPin, Users } from "lucide-react";
import GlassCard from "../components/GlassCard";
import StatCounter from "../components/StatCounter";
import ProblemCard from "../components/ProblemCard";
import { getMandalById } from "../data/geography";
import {
  getProblemsByMandal,
  getProblemStats,
  getMandalHealth,
} from "../data/mockData";
import { useProblems } from "../context/ProblemsContext";
import { useVolunteers } from "../context/VolunteersContext";

const HEALTH_LABEL = { green: "Healthy", yellow: "Moderate Issues", red: "Critical Issues" };
const HEALTH_COLOR = { green: "#059669", yellow: "#D97706", red: "#D32F2F" };

export default function MandalDashboard() {
  const { mandalId } = useParams();
  const mandal = getMandalById(mandalId);
  const { problems: allProblems } = useProblems();

  const problems = useMemo(
    () => (mandal ? getProblemsByMandal(allProblems, mandal.id) : []),
    [mandal, allProblems]
  );
  const stats = useMemo(() => getProblemStats(problems), [problems]);
  const health = mandal ? getMandalHealth(allProblems, mandal.id) : "green";
  const { volunteers: allVolunteers } = useVolunteers();
  const volunteers = allVolunteers.filter((v) => v.mandalId === mandalId);

  const villageData = useMemo(() => {
    if (!mandal) return [];
    return mandal.villages.map((v) => ({
      village: v,
      complaints: problems.filter((p) => p.village === v).length,
    }));
  }, [mandal, problems]);

  if (!mandal) return <Navigate to="/dashboard" replace />;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-brand-red">Avanigadda Constituency</p>
          <h1 className="text-3xl font-extrabold text-neutral-900 dark:text-white">{mandal.name}</h1>
          <p
            className="mt-1 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold text-white"
            style={{ backgroundColor: HEALTH_COLOR[health] }}
          >
            {HEALTH_LABEL[health]}
          </p>
        </div>
        <Link to="/report" className="rounded-lg bg-brand-red px-4 py-2 text-sm font-semibold text-white hover:bg-brand-red-dark">
          Report an Issue Here
        </Link>
      </div>

      <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <GlassCard className="!p-4 text-center"><p className="text-xl font-extrabold text-neutral-900 dark:text-white"><StatCounter value={stats.total} /></p><p className="text-[11px] text-neutral-500">Total</p></GlassCard>
        <GlassCard className="!p-4 text-center"><p className="text-xl font-extrabold text-emerald-600"><StatCounter value={stats.resolved} /></p><p className="text-[11px] text-neutral-500">Resolved</p></GlassCard>
        <GlassCard className="!p-4 text-center"><p className="text-xl font-extrabold text-amber-600"><StatCounter value={stats.pending} /></p><p className="text-[11px] text-neutral-500">Pending</p></GlassCard>
        <GlassCard className="!p-4 text-center"><p className="text-xl font-extrabold text-brand-red"><StatCounter value={stats.completionRate} suffix="%" /></p><p className="text-[11px] text-neutral-500">Completion</p></GlassCard>
        <GlassCard className="!p-4 text-center"><p className="text-xl font-extrabold text-sky-600"><StatCounter value={volunteers.length} /></p><p className="text-[11px] text-neutral-500">Volunteers</p></GlassCard>
        <GlassCard className="!p-4 text-center"><p className="text-xl font-extrabold text-indigo-600"><StatCounter value={mandal.villages.length} /></p><p className="text-[11px] text-neutral-500">Villages</p></GlassCard>
      </div>

      <div className="mb-8">
        <GlassCard>
          <h3 className="mb-2 flex items-center gap-2 text-sm font-bold text-neutral-800 dark:text-neutral-200">
            <Users size={16} className="text-indigo-600" /> Active Volunteers
          </h3>
          <ul className="space-y-1 text-sm text-neutral-600 dark:text-neutral-300">
            {volunteers.length === 0 && <li className="text-neutral-400">No volunteers assigned yet.</li>}
            {volunteers.slice(0, 3).map((v) => (
              <li key={v.id} className="flex justify-between">
                <span>{v.name}</span>
                <span className="font-semibold text-brand-red">{v.resolved} resolved</span>
              </li>
            ))}
          </ul>
        </GlassCard>
      </div>

      <GlassCard className="mb-8">
        <h3 className="mb-4 text-sm font-bold text-neutral-800 dark:text-neutral-200">Village-wise Complaints</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={villageData} margin={{ top: 4, right: 8, left: -20, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="village" angle={-40} textAnchor="end" interval={0} height={70} fontSize={11} />
              <YAxis allowDecimals={false} fontSize={11} />
              <Tooltip />
              <Bar dataKey="complaints" fill="#D32F2F" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>

      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-neutral-900 dark:text-white">Problems in {mandal.name}</h2>
      </div>
      {problems.length === 0 ? (
        <GlassCard className="py-10 text-center text-neutral-500">No problems reported in this Mandal yet.</GlassCard>
      ) : (
        <div className="mb-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {problems.map((p) => (
            <ProblemCard key={p.id} problem={p} />
          ))}
        </div>
      )}

      <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-neutral-900 dark:text-white">
        <MapPin size={20} className="text-brand-red" /> Villages in {mandal.name}
      </h2>
      <GlassCard className="flex flex-wrap gap-2">
        {mandal.villages.map((v) => (
          <span key={v} className="rounded-full bg-brand-yellow/20 px-3 py-1.5 text-sm font-medium text-neutral-800 dark:text-neutral-200">
            {v}
          </span>
        ))}
      </GlassCard>
    </div>
  );
}
