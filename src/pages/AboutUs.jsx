import React from "react";
import { Link } from "react-router-dom";
import {
  Mail,
  MapPin,
  FileText,
  Search,
  Settings2,
  CheckCircle2,
  Users,
  ShieldCheck,
  Clock,
  TrendingUp,
  Check,
  Palmtree,
  Sailboat,
} from "lucide-react";
import GlassCard from "../components/GlassCard";
import { CONTACT_EMAIL } from "../data/mockData";
import { MANDALS } from "../data/geography";
import aboutHero from "../assets/about-hero-cutout.png";

const COMMITMENTS = [
  { icon: Users, title: "People First", text: "Every citizen's problem matters. We listen, understand and act." },
  { icon: ShieldCheck, title: "Transparency", text: "We ensure transparency in handling issues at every step." },
  { icon: Clock, title: "Timely Action", text: "We work to ensure quick resolution through proper follow-up." },
  { icon: CheckCircle2, title: "Accountability", text: "We hold departments accountable and ensure responsible governance." },
  { icon: TrendingUp, title: "Better Avanigadda", text: "Together, we can build a cleaner, safer and better Avanigadda." },
];

const MISSION = [
  "To empower every citizen to raise their voice easily and fearlessly.",
  "To ensure that every issue reaches the concerned authority.",
  "To build a transparent and accountable system for the people.",
  "To work together for the overall development of Avanigadda.",
];

const HOW_IT_WORKS = [
  { icon: FileText, title: "Report", text: "Submit your issue with details and photos in just a few clicks." },
  { icon: Search, title: "Review", text: "Our team reviews and forwards it to the concerned department." },
  { icon: Settings2, title: "Action", text: "The department takes necessary action within the set timeframe." },
  { icon: CheckCircle2, title: "Resolution", text: "We follow up until the issue is resolved and the citizen is satisfied." },
];

export default function AboutUs() {
  return (
    <div>
      {/* Who We Are */}
      <section className="border-b border-neutral-200/70 bg-brand-cream px-4 py-14 dark:border-neutral-800 dark:bg-neutral-950 sm:px-6">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
          <div>
            <div className="mb-3 flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-brand-green dark:text-brand-yellow">
              <span className="h-px w-8 bg-brand-green dark:bg-brand-yellow" /> About Us
            </div>
            <h1 className="text-4xl font-extrabold leading-tight text-neutral-900 dark:text-white sm:text-5xl">
              Who We Are
            </h1>

            <p className="mt-6 text-lg font-semibold italic leading-snug text-brand-green dark:text-brand-yellow">
              <span className="mr-1 font-serif text-3xl not-italic leading-none text-brand-yellow">&ldquo;</span>
              Once, people had to go from office to office to talk about their
              problems&hellip; Now, the problem goes to the office, not the people!
              <span className="ml-1 font-serif text-3xl not-italic leading-none text-brand-yellow">&rdquo;</span>
            </p>

            <p className="mt-6 text-neutral-600 dark:text-neutral-400">
              This thought gave birth to <strong className="text-neutral-900 dark:text-white">&ldquo;Mana Avanigadda&rdquo;</strong> —
              a people-first platform to make governance more accessible, transparent, and effective.
            </p>
            <p className="mt-3 text-neutral-600 dark:text-neutral-400">
              We are here to bridge the gap between the public and the system, ensuring that every
              voice is heard, every issue is tracked, and every citizen is respected.
            </p>

            <Link
              to="/report"
              className="mt-8 inline-flex items-center gap-2 rounded-lg bg-brand-green px-6 py-3 text-sm font-bold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-brand-green-dark dark:bg-brand-yellow dark:text-neutral-900 dark:hover:bg-brand-yellow-dark"
            >
              <FileText size={18} /> Report an Issue
            </Link>
          </div>

          <div className="relative mx-auto w-full max-w-xl">
            <img
              src={aboutHero}
              alt="Community leader engaging with residents of Avanigadda"
              className="mx-auto w-full drop-shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* Our Commitment */}
      <section className="bg-white px-4 py-14 dark:bg-neutral-900 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-extrabold text-neutral-900 dark:text-white sm:text-3xl">Our Commitment</h2>
            <p className="mx-auto mt-2 max-w-xl text-neutral-500 dark:text-neutral-400">
              We are committed to building a stronger, more responsive Avanigadda by empowering
              citizens and working hand-in-hand with the administration.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
            {COMMITMENTS.map(({ icon: Icon, title, text }) => (
              <div key={title} className="text-center">
                <span className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-brand-green text-white dark:bg-brand-yellow dark:text-neutral-900">
                  <Icon size={26} />
                </span>
                <h3 className="font-bold text-neutral-900 dark:text-white">{title}</h3>
                <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Mission + How It Works */}
      <section className="bg-brand-cream px-4 py-14 dark:bg-neutral-950 sm:px-6">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 lg:grid-cols-2">
          <GlassCard>
            <h2 className="mb-4 text-lg font-bold text-neutral-900 dark:text-white">Our Mission</h2>
            <ul className="space-y-3">
              {MISSION.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-green text-white dark:bg-brand-yellow dark:text-neutral-900">
                    <Check size={13} />
                  </span>
                  <span className="text-sm text-neutral-600 dark:text-neutral-300">{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-6 flex items-center justify-center gap-3 rounded-xl bg-brand-green/5 py-4 dark:bg-brand-yellow/10">
              <Palmtree size={22} className="text-brand-green dark:text-brand-yellow" />
              <Sailboat size={26} className="text-brand-green dark:text-brand-yellow" />
              <Palmtree size={22} className="text-brand-green dark:text-brand-yellow" />
            </div>
          </GlassCard>

          <GlassCard className="grid grid-cols-1 gap-5 sm:grid-cols-[1fr_auto]">
            <div>
              <h2 className="mb-4 text-lg font-bold text-neutral-900 dark:text-white">How It Works</h2>
              <ul className="space-y-4">
                {HOW_IT_WORKS.map(({ icon: Icon, title, text }) => (
                  <li key={title} className="flex items-start gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-green/10 text-brand-green dark:bg-brand-yellow/15 dark:text-brand-yellow">
                      <Icon size={18} />
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-neutral-900 dark:text-white">{title}</h3>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">{text}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Phone mockup */}
            <div className="mx-auto hidden w-32 shrink-0 overflow-hidden rounded-[1.25rem] border-4 border-neutral-900 bg-white shadow-lg sm:block dark:border-neutral-700">
              <div className="bg-brand-green px-2 pb-3 pt-2 text-center text-white">
                <p className="text-[11px] font-extrabold leading-tight">Mana Avanigadda</p>
                <p className="text-[7px] leading-tight text-white/80">People&rsquo;s Voice, Our Responsibility</p>
              </div>
              <div className="space-y-1.5 p-2">
                <div className="flex items-center gap-1 rounded-full bg-brand-green px-2 py-1 text-[7px] font-bold text-white">
                  <FileText size={9} /> Report Problem
                </div>
                <div className="flex items-center gap-1 rounded-full border border-neutral-200 px-2 py-1 text-[7px] text-neutral-400">
                  <Search size={9} /> Track Issue
                </div>
                <div className="mt-1.5 flex h-12 items-center justify-center gap-1 rounded-lg bg-brand-cream">
                  <Palmtree size={14} className="text-brand-green" />
                  <Sailboat size={16} className="text-brand-green" />
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* Coverage Area + Contact */}
      <section className="bg-white px-4 py-14 dark:bg-neutral-900 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-extrabold text-neutral-900 dark:text-white sm:text-3xl">
              Reaching Every Corner of Avanigadda
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-neutral-500 dark:text-neutral-400">
              From Avanigadda town to the farthest villages — one platform, one community.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <GlassCard>
              <h3 className="mb-3 text-lg font-bold text-neutral-900 dark:text-white">Coverage Area</h3>
              <p className="mb-3 text-sm text-neutral-500">Avanigadda Constituency — 6 Mandals</p>
              <div className="flex flex-wrap gap-2">
                {MANDALS.map((m) => (
                  <span key={m.id} className="rounded-full bg-brand-yellow/20 px-3 py-1.5 text-sm font-medium text-neutral-800 dark:text-neutral-200">
                    {m.name}
                  </span>
                ))}
              </div>
            </GlassCard>

            <GlassCard>
              <h3 className="mb-3 text-lg font-bold text-neutral-900 dark:text-white">Get in Touch</h3>
              <p className="flex items-center gap-2 text-neutral-600 dark:text-neutral-300">
                <Mail size={16} className="text-brand-red" /> {CONTACT_EMAIL}
              </p>
              <p className="mt-2 flex items-center gap-2 text-neutral-600 dark:text-neutral-300">
                <MapPin size={16} className="text-brand-red" /> Avanigadda Constituency, Andhra Pradesh, India
              </p>
            </GlassCard>
          </div>
        </div>
      </section>
    </div>
  );
}
