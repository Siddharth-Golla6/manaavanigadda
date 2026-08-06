import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { PieChart as PieChartIcon } from "lucide-react";
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid,
} from "recharts";
import GlassCard from "../components/GlassCard";
import MandalCard from "../components/MandalCard";
import ProblemCard from "../components/ProblemCard";
import ProblemFilters, { DEFAULT_FILTERS, applyFilters } from "../components/ProblemFilters";
import { CardGridSkeleton } from "../components/Skeleton";
import { MANDALS } from "../data/geography";
import { CATEGORY_OPTIONS } from "../data/mockData";
import { useProblems } from "../context/ProblemsContext";
import { useLang } from "../context/LanguageContext";
import useDelayedReady from "../hooks/useDelayedReady";

const PIE_COLORS = ["#D32F2F", "#FFC107", "#059669", "#0891B2", "#7C3AED", "#EA580C", "#4B5563", "#DB2777"];

export default function Dashboard() {
  const { t } = useLang();
  const ready = useDelayedReady(500);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const { problems } = useProblems();

  const filteredProblems = useMemo(() => applyFilters(problems, filters), [problems, filters]);

  const solvedByDepartment = useMemo(
    () =>
      CATEGORY_OPTIONS.map((c) => ({
        name: t(`cat.${c}`),
        value: problems.filter((p) => p.category === c && p.status === "Completed").length,
      })).filter((d) => d.value > 0),
    [problems, t]
  );

  const departmentWorkload = useMemo(
    () =>
      CATEGORY_OPTIONS.map((c) => {
        const inCategory = problems.filter((p) => p.category === c);
        return {
          name: t(`cat.${c}`),
          total: inCategory.length,
          resolved: inCategory.filter((p) => p.status === "Completed").length,
        };
      }).filter((d) => d.total > 0),
    [problems, t]
  );

  const byCategory = useMemo(
    () =>
      CATEGORY_OPTIONS.map((c) => ({
        name: t(`cat.${c}`),
        value: problems.filter((p) => p.category === c).length,
      })).filter((c) => c.value > 0),
    [problems, t]
  );

  return (
    <div>
      <section className="border-b border-neutral-200 bg-gradient-to-br from-brand-yellow/15 via-white to-brand-red/5 px-4 py-10 dark:border-neutral-800 dark:from-neutral-900 dark:via-neutral-950 dark:to-neutral-900 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <p className="mb-1 text-sm font-semibold uppercase tracking-wide text-brand-red">
            {t("dashboard.constituency")}
          </p>
          <h1 className="text-3xl font-extrabold text-neutral-900 dark:text-white sm:text-4xl">
            {t("dashboard.title")}
          </h1>
          <p className="mt-2 max-w-2xl text-neutral-600 dark:text-neutral-400">
            {t("dashboard.subtitle")}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white">{t("dashboard.mandalsAtGlance")}</h2>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {MANDALS.map((m) => (
            <MandalCard key={m.id} mandal={m} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-10 sm:px-6">
        <div className="mb-5 flex items-center gap-2">
          <PieChartIcon size={20} className="text-brand-red" />
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white">{t("dashboard.analytics")}</h2>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <GlassCard>
            <h3 className="mb-1 text-sm font-bold text-neutral-800 dark:text-neutral-200">{t("dashboard.byCategory")}</h3>
            <p className="mb-3 text-xs text-neutral-500 dark:text-neutral-400">
              {t("dashboard.byCategoryDesc")}
            </p>
            {byCategory.length === 0 ? (
              <div className="flex h-64 items-center justify-center text-sm text-neutral-500">
                {t("dashboard.noComplaintsYet")}
              </div>
            ) : (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={byCategory} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={85} label={{ fontSize: 10 }}>
                      {byCategory.map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </GlassCard>

          <GlassCard>
            <h3 className="mb-1 text-sm font-bold text-neutral-800 dark:text-neutral-200">{t("dashboard.solvedByDept")}</h3>
            <p className="mb-3 text-xs text-neutral-500 dark:text-neutral-400">
              {t("dashboard.solvedByDeptDesc")}
            </p>
            {solvedByDepartment.length === 0 ? (
              <div className="flex h-64 items-center justify-center text-sm text-neutral-500">
                {t("dashboard.noSolvedYet")}
              </div>
            ) : (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={solvedByDepartment} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={85} label={{ fontSize: 10 }}>
                      {solvedByDepartment.map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </GlassCard>

          <GlassCard>
            <h3 className="mb-1 text-sm font-bold text-neutral-800 dark:text-neutral-200">{t("dashboard.deptProgress")}</h3>
            <p className="mb-3 text-xs text-neutral-500 dark:text-neutral-400">
              {t("dashboard.deptProgressDesc")}
            </p>
            {departmentWorkload.length === 0 ? (
              <div className="flex h-64 items-center justify-center text-sm text-neutral-500">
                {t("dashboard.noComplaintsYet")}
              </div>
            ) : (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={departmentWorkload} layout="vertical" margin={{ left: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis type="number" allowDecimals={false} fontSize={11} />
                    <YAxis type="category" dataKey="name" fontSize={10} width={110} />
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Bar dataKey="total" name={t("dashboard.chart.reported")} fill="#FFC107" radius={[0, 4, 4, 0]} />
                    <Bar dataKey="resolved" name={t("dashboard.chart.resolved")} fill="#059669" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </GlassCard>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white">{t("dashboard.communityProblems")}</h2>
          <Link to="/report" className="text-sm font-semibold text-brand-red hover:underline">
            {t("dashboard.reportAProblem")}
          </Link>
        </div>

        <div className="mb-6">
          <ProblemFilters filters={filters} onChange={setFilters} />
        </div>

        {!ready ? (
          <CardGridSkeleton count={6} />
        ) : filteredProblems.length === 0 ? (
          <GlassCard className="py-12 text-center text-neutral-500">{t("dashboard.noProblemsMatch")}</GlassCard>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProblems.map((problem) => (
              <ProblemCard key={problem.id} problem={problem} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
