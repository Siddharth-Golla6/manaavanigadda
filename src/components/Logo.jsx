import React from "react";
import { useLang } from "../context/LanguageContext";
import Tagline from "./Tagline";

export default function Logo({ size = 40, showText = true, className = "" }) {
  const { t } = useLang();
  if (!showText) return null;

  return (
    <div className={`leading-tight ${className}`}>
      <p className="text-base font-bold tracking-tight text-neutral-900 dark:text-white">
        {t("brand.name")}
      </p>
      <p className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400">
        <Tagline />
      </p>
    </div>
  );
}
