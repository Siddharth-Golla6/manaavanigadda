import React from "react";
import { Link } from "react-router-dom";
import { useLang } from "../context/LanguageContext";

export default function NotFound() {
  const { t } = useLang();
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <p className="text-7xl font-extrabold text-brand-red">{t("notFound.code")}</p>
      <h1 className="mt-2 text-xl font-bold text-neutral-900 dark:text-white">{t("notFound.title")}</h1>
      <p className="mt-1 text-neutral-500">{t("notFound.body")}</p>
      <Link to="/" className="mt-6 rounded-lg bg-brand-red px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-red-dark">
        {t("notFound.backHome")}
      </Link>
    </div>
  );
}
