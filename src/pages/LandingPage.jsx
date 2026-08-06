import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, FileText, ShieldCheck, Users, Users2 } from "lucide-react";
import LandingNavbar from "../components/LandingNavbar";
import landingBg from "../assets/landing-bg.jpg";
import { useLang } from "../context/LanguageContext";

const FEATURES = [
  { icon: Users, titleKey: "landing.feature1.title", textKey: "landing.feature1.text" },
  { icon: ShieldCheck, titleKey: "landing.feature2.title", textKey: "landing.feature2.text" },
  { icon: Users2, titleKey: "landing.feature3.title", textKey: "landing.feature3.text" },
];

export default function LandingPage() {
  const { t } = useLang();
  return (
    <div className="min-h-screen bg-brand-cream dark:bg-neutral-950">
      <LandingNavbar />

      <section className="relative isolate overflow-hidden">
        <img
          src={landingBg}
          alt={t("landing.heroAlt")}
          className="absolute inset-0 -z-10 h-full w-full object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-brand-green/95 via-brand-green/80 to-brand-green/40 dark:from-neutral-950/95 dark:via-neutral-950/85 dark:to-neutral-950/50" />

        <div
          className="mx-auto flex min-h-[520px] max-w-7xl flex-col justify-center px-6 py-16 sm:min-h-[600px] lg:py-24"
          style={{ animation: "pageFade 0.7s ease-out both" }}
        >
          <h1 className="max-w-2xl text-5xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-6xl">
            {t("landing.headline1")}
            <br />
            <span className="text-brand-yellow">{t("landing.headline2")}</span>
          </h1>

          <div className="mt-5 h-1.5 w-16 rounded-full bg-brand-yellow" />

          <p className="mt-6 max-w-md text-lg leading-relaxed text-white/90">
            {t("landing.tagline")}
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link
              to="/dashboard"
              aria-label={t("landing.cta.getStarted")}
              className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-brand-yellow px-5 py-3 text-sm font-bold text-neutral-900 shadow-lg transition hover:-translate-y-0.5 hover:bg-brand-yellow-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-green sm:gap-2 sm:px-7 sm:py-3.5 sm:text-base"
            >
              {t("landing.cta.getStarted")} <ArrowRight size={18} />
            </Link>

            <Link
              to="/report"
              aria-label={t("landing.cta.report")}
              className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border-2 border-white px-5 py-2.5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-green sm:gap-2 sm:px-7 sm:py-3 sm:text-base"
            >
              <FileText size={18} /> {t("landing.cta.report")}
            </Link>
          </div>
        </div>
      </section>

      {/* Feature strip */}
      <div
        className="border-t border-neutral-200/70 bg-brand-cream px-6 py-10 dark:border-neutral-800 dark:bg-neutral-950"
        style={{ animation: "pageFade 0.9s ease-out 0.3s both" }}
      >
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 sm:grid-cols-3 sm:divide-x sm:divide-neutral-200 dark:sm:divide-neutral-800">
          {FEATURES.map(({ icon: Icon, titleKey, textKey }, i) => (
            <div key={titleKey} className={`flex items-start gap-4 ${i > 0 ? "sm:pl-8" : ""}`}>
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-brand-yellow/20">
                <Icon size={24} className="text-brand-green dark:text-brand-yellow" />
              </span>
              <div>
                <h3 className="font-bold text-neutral-900 dark:text-white">{t(titleKey)}</h3>
                <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">{t(textKey)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
