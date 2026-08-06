import React, { useState } from "react";
import { ChevronDown, ChevronRight, MapPin, Users } from "lucide-react";
import GlassCard from "../../components/GlassCard";
import { MANDALS } from "../../data/geography";
import { useProblems } from "../../context/ProblemsContext";
import { useVolunteers } from "../../context/VolunteersContext";
import { useLang } from "../../context/LanguageContext";
import { getProblemsByMandal } from "../../data/mockData";

export default function GeographyPanel() {
  const { t } = useLang();
  const [open, setOpen] = useState(MANDALS[0]?.id);
  const { problems } = useProblems();
  const { volunteers: allVolunteers } = useVolunteers();

  return (
    <div>
      <h2 className="mb-1 text-lg font-bold text-neutral-900 dark:text-white">{t("admin.geo.pageTitle")}</h2>
      <p className="mb-4 text-sm text-neutral-500">
        {t("admin.geo.summary", {
          constituency: t("dashboard.constituency"),
          mandals: MANDALS.length,
          villages: MANDALS.reduce((s, m) => s + m.villages.length, 0),
        })}
      </p>

      <div className="space-y-3">
        {MANDALS.map((m) => {
          const isOpen = open === m.id;
          const mandalProblems = getProblemsByMandal(problems, m.id);
          const volunteers = allVolunteers.filter((v) => v.mandalId === m.id);
          return (
            <GlassCard key={m.id} className="!p-0">
              <button
                onClick={() => setOpen(isOpen ? null : m.id)}
                className="flex w-full items-center justify-between px-5 py-4 text-left"
              >
                <div>
                  <p className="font-bold text-neutral-900 dark:text-white">{m.name}</p>
                  <p className="text-xs text-neutral-500">
                    {t("admin.geo.mandalSummary", {
                      villages: m.villages.length,
                      complaints: mandalProblems.length,
                      volunteers: volunteers.length,
                    })}
                  </p>
                </div>
                {isOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
              </button>
              {isOpen && (
                <div className="border-t border-neutral-200 px-5 py-4 dark:border-neutral-800">
                  <p className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase text-neutral-400">
                    <MapPin size={12} /> {t("admin.geo.villagesLabel")}
                  </p>
                  <div className="mb-4 flex flex-wrap gap-2">
                    {m.villages.map((v) => (
                      <span key={v} className="rounded-full bg-brand-yellow/20 px-2.5 py-1 text-xs font-medium text-neutral-800 dark:text-neutral-200">
                        {v}
                      </span>
                    ))}
                  </div>
                  <p className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase text-neutral-400">
                    <Users size={12} /> {t("admin.geo.volunteersLabel")}
                  </p>
                  {volunteers.length === 0 ? (
                    <p className="text-xs text-neutral-400">{t("admin.geo.noVolunteers")}</p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {volunteers.map((v) => (
                        <span key={v.id} className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-700 dark:bg-neutral-800 dark:text-neutral-200">
                          {v.name} · {t("mandal.resolvedCount", { n: v.resolved })}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
}
