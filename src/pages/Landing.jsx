import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, FileText, ShieldAlert, Award, GraduationCap, ExternalLink, Loader2 } from "lucide-react";
import HeroSection from "@/components/features/HeroSection";
import StatsSection from "@/components/features/StatsSection";
import FeaturesGrid from "@/components/features/FeaturesGrid";
import SmartSearchSection from "@/components/features/SmartSearchSection";
import HowItWorks from "@/components/features/HowItWorks";
import TestimonialsSection from "@/components/features/TestimonialsSection";
import CTASection from "@/components/features/CTASection";
import { documentGuides } from "@/data/documentGuides";
import { helplines } from "@/data/womenSafety";
import { useScholarships } from "@/hooks/useScholarships";
import { useSchemes } from "@/hooks/useSchemes";
import { cn } from "@/lib/utils";

const SCHEME_PALETTES = [
  "bg-blue-100 text-blue-700",
  "bg-emerald-100 text-emerald-700",
  "bg-purple-100 text-purple-700",
];

function adaptScheme(s, i) {
  return {
    id: s._id,
    name: s.title,
    category: s.category || "General",
    description: s.description || s.eligibility || "",
    benefit: s.benefits || "See details",
    officialUrl: s.officialLink || "https://www.india.gov.in",
    color: SCHEME_PALETTES[i % SCHEME_PALETTES.length],
  };
}

export default function Landing() {
  const featuredGuides = documentGuides.slice(0, 6);
  const featuredHelplines = helplines.slice(0, 3);

  // Live scheme data (sourced from Gemini + Google Search at seed/refresh
  // time, admin-managed thereafter) — no mock data.
  const { data: schemeData, isLoading: schemesLoading, isError: schemesError } =
    useSchemes({ limit: 3 });
  const featuredSchemes = (schemeData?.items ?? []).map(adaptScheme);

  // Live AI-searched scholarships (Gemini + Google Search grounding) — no mock data.
  const { data: scholarshipData, isLoading: scholarshipsLoading, isError: scholarshipsError } =
    useScholarships({ limit: 3 });
  const featuredScholarships = scholarshipData?.items ?? [];

  return (
    <>
      <HeroSection />
      <StatsSection />
      <FeaturesGrid />

      {/* IDENTITY DOCUMENTS */}
      <section className="relative py-16 sm:py-20 overflow-hidden">
        <div className="absolute -top-16 left-1/3 w-96 h-96 rounded-full bg-indigo-200/30 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHead
            eyebrow="DOCUMENT GUIDES"
            icon={<FileText className="w-4 h-4" />}
            title="Identity documents — decoded"
            subtitle="Complete step-by-step guides for Aadhaar, PAN, Passport, Driving License and more. Fees, timelines, forms and official portals."
            ctaTo="/documents"
            ctaLabel="Browse all guides"
          />
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featuredGuides.map((g, i) => {
              const Icon = g.Icon;
              return (
                <motion.div
                  key={g.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04 }}
                >
                  <Link to={`/documents/${g.slug}`} className="glass-card glass-hover gradient-border rounded-3xl p-5 flex flex-col h-full">
                    <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner", g.color)}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="mt-3 flex items-center gap-1.5">
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold border bg-indigo-50 text-indigo-700 border-indigo-100 uppercase tracking-wider">
                        {g.category}
                      </span>
                    </div>
                    <h3 className="mt-2 text-lg font-bold text-slate-900">{g.name}</h3>
                    <p className="mt-1.5 text-sm text-slate-600 line-clamp-2 flex-1">{g.short}</p>
                    <div className="mt-3 flex items-center justify-between text-xs">
                      <span className="text-slate-500">
                        <span className="font-semibold text-slate-800">{g.fees.split(" ·")[0]}</span> · {g.time}
                      </span>
                      <span className="inline-flex items-center gap-1 text-indigo-600 font-semibold">
                        Read <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SCHEMES (Educational) */}
      <section className="relative py-16 sm:py-20 overflow-hidden">
        <div className="absolute -top-8 left-8 w-96 h-96 rounded-full bg-purple-200/30 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHead
            eyebrow="GOVERNMENT SCHEMES"
            icon={<Award className="w-4 h-4" />}
            title="Understand every major government scheme"
            subtitle="Who can apply, what you get, documents needed and how to apply on the official portal — all in plain language."
            ctaTo="/schemes"
            ctaLabel="Browse schemes"
          />
          {schemesLoading && (
            <div className="mt-10 flex items-center justify-center gap-2 text-sm text-slate-500 py-10">
              <Loader2 className="w-4 h-4 animate-spin" /> Loading current government schemes…
            </div>
          )}

          {!schemesLoading && schemesError && (
            <div className="mt-10 text-center text-sm text-slate-500 py-10">
              Couldn't load schemes right now — visit the{" "}
              <Link to="/schemes" className="font-semibold text-indigo-700">Schemes page</Link> to try again.
            </div>
          )}

          {!schemesLoading && !schemesError && (
            <div className="mt-10 grid md:grid-cols-3 gap-5">
              {featuredSchemes.map((s, i) => (
                <motion.div
                  key={s.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="glass-card glass-hover gradient-border rounded-3xl p-5 flex flex-col"
                >
                  <div className="flex items-center justify-between">
                    <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center", s.color)}>
                      <Award className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-full uppercase tracking-wider">
                      {s.category}
                    </span>
                  </div>
                  <h3 className="mt-4 text-base font-bold text-slate-900 line-clamp-2">{s.name}</h3>
                  <p className="mt-1 text-sm text-slate-600 line-clamp-2 flex-1">{s.description}</p>
                  <div className="mt-3 text-lg font-extrabold brand-gradient-text">{s.benefit}</div>
                  <a
                    href={s.officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-800"
                  >
                    Official site <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* SCHOLARSHIPS */}
      <section className="relative py-16 sm:py-20 overflow-hidden">
        <div className="absolute top-10 -right-16 w-96 h-96 rounded-full bg-emerald-200/30 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHead
            eyebrow="SCHOLARSHIPS"
            icon={<GraduationCap className="w-4 h-4" />}
            title="Understand scholarships before you apply"
            subtitle="Government, private and international scholarships — eligibility, amounts, deadlines and how to apply on the official portal."
            ctaTo="/scholarships"
            ctaLabel="See all scholarships"
          />
          {scholarshipsLoading && (
            <div className="mt-10 flex items-center justify-center gap-2 text-sm text-slate-500 py-10">
              <Loader2 className="w-4 h-4 animate-spin" /> Searching the web for current scholarships…
            </div>
          )}

          {!scholarshipsLoading && scholarshipsError && (
            <div className="mt-10 text-center text-sm text-slate-500 py-10">
              Couldn't load live scholarships right now — visit the{" "}
              <Link to="/scholarships" className="font-semibold text-indigo-700">Scholarships page</Link> to try again.
            </div>
          )}

          {!scholarshipsLoading && !scholarshipsError && (
            <div className="mt-10 grid md:grid-cols-3 gap-5">
              {featuredScholarships.map((s, i) => (
                <motion.a
                  key={s.id}
                  href={s.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="glass-card glass-hover gradient-border rounded-3xl p-5 flex flex-col"
                >
                  <div className="flex items-center justify-between">
                    <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center", s.color)}>
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-full">
                      {s.type}
                    </span>
                  </div>
                  <h3 className="mt-4 text-base font-bold text-slate-900 line-clamp-2">{s.name}</h3>
                  <div className="mt-1 text-xs text-slate-500 truncate">{s.provider}</div>
                  <div className="mt-3 text-lg font-extrabold brand-gradient-text">{s.amount}</div>
                  <div className="mt-2 text-xs text-slate-500">Deadline: <span className="font-semibold text-slate-800">{s.deadline || "Check official site"}</span></div>
                </motion.a>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* WOMEN SAFETY */}
      <section className="relative py-16 sm:py-20 overflow-hidden">
        <div className="absolute -top-8 -left-8 w-96 h-96 rounded-full bg-rose-200/30 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHead
            eyebrow="WOMEN SAFETY"
            icon={<ShieldAlert className="w-4 h-4" />}
            title="Know the helplines, know your rights"
            subtitle="Official 24×7 helplines, complaint portals, safety apps and key laws — everything a woman in India should know."
            ctaTo="/women-safety"
            ctaLabel="Learn more"
          />
          <div className="mt-10 grid md:grid-cols-3 gap-5">
            {featuredHelplines.map((h, i) => (
              <motion.a
                key={h.id}
                href={`tel:${h.number.replace(/[^\d]/g, "")}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="glass-card glass-hover rounded-3xl p-5"
              >
                <div className="w-11 h-11 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <h3 className="mt-3 text-base font-bold text-slate-900">{h.name}</h3>
                <div className="mt-1 text-2xl font-extrabold brand-gradient-text">{h.number}</div>
                <div className="mt-1 text-xs text-slate-500">{h.hours}</div>
                <p className="mt-2 text-sm text-slate-600 line-clamp-2">{h.description}</p>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      <SmartSearchSection />
      <HowItWorks />
      <TestimonialsSection />
      <CTASection />
    </>
  );
}

function SectionHead({
  eyebrow,
  title,
  subtitle,
  ctaTo,
  ctaLabel,
  icon
}) {
  return (
    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass text-[10px] font-bold uppercase tracking-wider text-indigo-700">
          {icon || <Sparkles className="w-3.5 h-3.5" />} {eyebrow}
        </div>
        <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-slate-900 max-w-xl tracking-tight">{title}</h2>
        <p className="mt-2 text-slate-600 max-w-2xl">{subtitle}</p>
      </div>
      <Link
        to={ctaTo}
        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full glass hover:bg-white text-sm font-semibold text-indigo-700 self-start md:self-end transition"
      >
        {ctaLabel} <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}
