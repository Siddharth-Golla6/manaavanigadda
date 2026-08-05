import React from "react";
import { Link } from "react-router-dom";
import { Mail, MapPin } from "lucide-react";
import Logo from "./Logo";
import { CONTACT_EMAIL } from "../data/mockData";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-neutral-200 bg-white/70 dark:border-neutral-800 dark:bg-neutral-950">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-3">
        <div>
          <Logo size={40} />
          <p className="mt-3 max-w-xs text-sm text-neutral-500 dark:text-neutral-400">
            One digital platform for community development, public grievances,
            and citizen participation across Avanigadda Constituency.
          </p>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-bold uppercase tracking-wide text-neutral-800 dark:text-neutral-200">
            Quick Links
          </h4>
          <ul className="space-y-2 text-sm text-neutral-500 dark:text-neutral-400">
            <li><Link to="/dashboard" className="hover:text-brand-red">Dashboard</Link></li>
            <li><Link to="/report" className="hover:text-brand-red">Report a Problem</Link></li>
            <li><Link to="/about" className="hover:text-brand-red">About Us</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-bold uppercase tracking-wide text-neutral-800 dark:text-neutral-200">
            Contact
          </h4>
          <p className="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400">
            <Mail size={14} /> {CONTACT_EMAIL}
          </p>
          <p className="mt-2 flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400">
            <MapPin size={14} /> Avanigadda Constituency, Andhra Pradesh
          </p>
        </div>
      </div>
      <div className="border-t border-neutral-200 py-4 text-center text-xs text-neutral-400 dark:border-neutral-800">
        © {new Date().getFullYear()} Mana Avanigadda. Prototype build — sample data shown throughout.
      </div>
    </footer>
  );
}
