import React from "react";
import { Link } from "react-router-dom";
import { Mail, MapPin } from "lucide-react";
import Logo from "./Logo";
import { CONTACT_EMAIL } from "../data/mockData";
import { useLang } from "../context/LanguageContext";

export default function Footer() {
  const { t } = useLang();
  return (
    <footer className="mt-16 border-t border-neutral-200 bg-white/70 dark:border-neutral-800 dark:bg-neutral-950">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-3">
        <div>
          <Logo size={40} />
          <p className="mt-3 max-w-xs text-sm text-neutral-500 dark:text-neutral-400">
            {t("footer.description")}
          </p>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-bold uppercase tracking-wide text-neutral-800 dark:text-neutral-200">
            {t("footer.quickLinks")}
          </h4>
          <ul className="space-y-2 text-sm text-neutral-500 dark:text-neutral-400">
            <li><Link to="/dashboard" className="hover:text-brand-red">{t("footer.dashboard")}</Link></li>
            <li><Link to="/report" className="hover:text-brand-red">{t("footer.report")}</Link></li>
            <li><Link to="/about" className="hover:text-brand-red">{t("footer.about")}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-bold uppercase tracking-wide text-neutral-800 dark:text-neutral-200">
            {t("footer.contact")}
          </h4>
          <p className="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400">
            <Mail size={14} /> {CONTACT_EMAIL}
          </p>
          <p className="mt-2 flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400">
            <MapPin size={14} /> {t("footer.location")}
          </p>
        </div>
      </div>
      <div className="border-t border-neutral-200 py-4 text-center text-xs text-neutral-400 dark:border-neutral-800">
        {t("footer.copyright", { year: new Date().getFullYear() })}
      </div>
    </footer>
  );
}
