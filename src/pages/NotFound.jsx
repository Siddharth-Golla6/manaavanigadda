import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <p className="text-7xl font-extrabold text-brand-red">404</p>
      <h1 className="mt-2 text-xl font-bold text-neutral-900 dark:text-white">Page not found</h1>
      <p className="mt-1 text-neutral-500">The page you're looking for doesn't exist.</p>
      <Link to="/" className="mt-6 rounded-lg bg-brand-red px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-red-dark">
        Back to Home
      </Link>
    </div>
  );
}
