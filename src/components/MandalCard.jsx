import React from "react";
import { Link } from "react-router-dom";
import { MapPin, ChevronRight } from "lucide-react";
import { getMandalHealth, getProblemsByMandal, getProblemStats } from "../data/mockData";
import { useProblems } from "../context/ProblemsContext";
import { useLang } from "../context/LanguageContext";

const HEALTH_STYLES = {
  green: {
    ring: "ring-emerald-400/60",
    dot: "bg-emerald-500",
    labelKey: "mandal.health.healthy",
    text: "text-emerald-700 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-500/10",
  },
  yellow: {
    ring: "ring-amber-400/60",
    dot: "bg-amber-500",
    labelKey: "mandal.health.moderate",
    text: "text-amber-700 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-500/10",
  },
  red: {
    ring: "ring-red-400/60",
    dot: "bg-red-500",
    labelKey: "mandal.health.critical",
    text: "text-red-700 dark:text-red-400",
    bg: "bg-red-50 dark:bg-red-500/10",
  },
};

export default function MandalCard({ mandal }) {
  const { problems } = useProblems();
  const { t } = useLang();
  const health = getMandalHealth(problems, mandal.id);
  const style = HEALTH_STYLES[health];
  const stats = getProblemStats(getProblemsByMandal(problems, mandal.id));

  return (
    <Link
      to={`/mandal/${mandal.id}`}
      className={`glass-card group block ring-1 ${style.ring} p-5 transition-transform hover:-translate-y-1`}
    >
      <div className="mb-3 flex items-center justify-between">
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${style.bg} ${style.text}`}>
          <span className={`h-2 w-2 rounded-full ${style.dot}`} />
          {t(style.labelKey)}
        </span>
        <ChevronRight size={18} className="text-neutral-400 transition-transform group-hover:translate-x-1" />
      </div>

      <h3 className="mb-1 text-lg font-bold text-neutral-900 dark:text-white">{mandal.name}</h3>
      <p className="mb-4 flex items-center gap-1 text-xs text-neutral-500 dark:text-neutral-400">
        <MapPin size={12} /> {t("mandal.villagesCount", { n: mandal.villages.length })}
      </p>

      <div className="grid grid-cols-3 gap-2 text-center">
        <div>
          <p className="text-lg font-bold text-neutral-900 dark:text-white">{stats.total}</p>
          <p className="text-[10px] uppercase tracking-wide text-neutral-500">{t("mandal.stats.total")}</p>
        </div>
        <div>
          <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{stats.resolved}</p>
          <p className="text-[10px] uppercase tracking-wide text-neutral-500">{t("mandal.stats.resolved")}</p>
        </div>
        <div>
          <p className="text-lg font-bold text-brand-red">{stats.pending}</p>
          <p className="text-[10px] uppercase tracking-wide text-neutral-500">{t("mandal.stats.pending")}</p>
        </div>
      </div>
    </Link>
  );
}
