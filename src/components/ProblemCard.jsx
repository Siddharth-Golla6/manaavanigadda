import React from "react";
import { Link } from "react-router-dom";
import { MapPin, ThumbsUp } from "lucide-react";
import { StatusBadge, PriorityBadge } from "./Badges";

export default function ProblemCard({ problem }) {
  return (
    <Link
      to={`/problem/${problem.id}`}
      className="glass-card group flex flex-col overflow-hidden hover:-translate-y-1"
    >
      <div className="relative h-44 w-full overflow-hidden">
        <img
          src={problem.photo}
          alt={problem.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <span className="absolute left-3 top-3 shadow">
          <PriorityBadge priority={problem.priority} />
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-center justify-between gap-2">
          <StatusBadge status={problem.status} />
          <span className="flex items-center gap-1 text-xs text-neutral-500">
            <ThumbsUp size={12} /> {problem.supportCount}
          </span>
        </div>

        <h3 className="line-clamp-2 text-base font-bold text-neutral-900 dark:text-white">
          {problem.title}
        </h3>
        <p className="line-clamp-2 text-sm text-neutral-500 dark:text-neutral-400">
          {problem.description}
        </p>

        <p className="mt-auto flex items-center gap-1 pt-1 text-xs font-medium text-neutral-500 dark:text-neutral-400">
          <MapPin size={12} className="text-brand-red" />
          {problem.village}, {problem.mandalName}
        </p>
      </div>
    </Link>
  );
}
