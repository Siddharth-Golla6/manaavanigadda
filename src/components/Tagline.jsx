import React from "react";
import { useLang } from "../context/LanguageContext";

function Word({ text }) {
  return (
    <>
      <span className="font-bold text-brand-red dark:text-brand-yellow">{text.slice(0, 1)}</span>
      {text.slice(1)}
    </>
  );
}

// Renders "Transparency • Dedication • Progress" (or its Telugu equivalent)
// with the first letter of each word highlighted. Used anywhere the tagline
// appears under the "Mana Avanigadda" brand name.
export default function Tagline() {
  const { t } = useLang();
  return (
    <>
      <Word text={t("brand.taglineWord1")} /> • <Word text={t("brand.taglineWord2")} /> • <Word text={t("brand.taglineWord3")} />
    </>
  );
}
