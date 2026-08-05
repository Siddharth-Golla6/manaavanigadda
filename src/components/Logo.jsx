import React from "react";

export default function Logo({ size = 40, showText = true, className = "" }) {
  if (!showText) return null;

  return (
    <div className={`leading-tight ${className}`}>
      <p className="text-base font-bold tracking-tight text-neutral-900 dark:text-white">
        Mana Avanigadda
      </p>
      <p className="text-[11px] font-medium text-brand-red dark:text-brand-yellow">
        One Community. One Vision.
      </p>
    </div>
  );
}
