import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";
import {
  Sparkles,
  ArrowRight,
  FileText,
  ShieldCheck,
  BookOpen,
  Award,
  Bot,
  ShieldAlert,
  Search,
  ExternalLink,
} from "lucide-react";

const quickChips = [
  { label: "Aadhaar Card", to: "/documents/aadhaar-card" },
  { label: "PAN Card", to: "/documents/pan-card" },
  { label: "Passport", to: "/documents/passport" },
  { label: "Ration Card", to: "/documents/ration-card" },
  { label: "Income Certificate", to: "/documents/income-certificate" },
];

export default function HeroSection() {
  const [q, setQ] = useState("");
  const navigate = useNavigate();

  const submit = (e) => {
    e.preventDefault();
    if (!q.trim()) return navigate("/documents");
    navigate(`/documents?q=${encodeURIComponent(q)}`);
  };

  return (
    <section className="relative overflow-hidden">
      <div className="absolute -top-24 -left-24 w-[520px] h-[520px] rounded-full bg-indigo-300/30 blur-3xl float-slower" />
      <div className="absolute top-24 -right-32 w-[520px] h-[520px] rounded-full bg-purple-300/30 blur-3xl float-slower" />
      <div className="absolute bottom-0 left-1/3 w-[420px] h-[420px] rounded-full bg-emerald-200/40 blur-3xl float-slow" />
      <div className="absolute inset-0 pattern-grid opacity-50" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-14 pb-24 lg:pt-24 lg:pb-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs font-semibold text-indigo-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              A citizen guidance portal · Not an application website
            </div>

            <h1 className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.05] text-slate-900 tracking-tight">
              Every government{" "}
              <span className="brand-gradient-text">document & scheme</span>
              , explained step-by-step
            </h1>

            <p className="mt-5 text-lg text-slate-600 max-w-xl leading-relaxed">
              Learn the exact process, required papers, fees, timelines and official portals for Aadhaar, PAN, Passport, schemes, scholarships and more — all in plain language.
            </p>

            <form onSubmit={submit} className="mt-8 max-w-xl">
              <div className="glass-strong rounded-2xl p-2 flex items-center gap-2 shadow-lg">
                <div className="pl-3 text-slate-400">
                  <Search className="w-5 h-5" />
                </div>
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search Aadhaar, PAN, ration card, scholarship…"
                  className="flex-1 h-11 bg-transparent text-sm focus:outline-none placeholder:text-slate-400"
                />
                <button
                  type="submit"
                  className="h-11 px-5 rounded-xl brand-gradient text-white font-semibold text-sm shadow-md hover:-translate-y-0.5 transition"
                >
                  Search
                </button>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs">
                <span className="text-slate-500">Popular:</span>
                {quickChips.map((c) => (
                  <Link
                    key={c.label}
                    to={c.to}
                    className="px-2.5 py-1 rounded-full glass text-slate-700 hover:text-indigo-700 hover:bg-white/80 transition text-[11px] font-medium"
                  >
                    {c.label}
                  </Link>
                ))}
              </div>
            </form>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link
                to="/documents"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full brand-gradient text-white font-semibold shadow-lg shadow-indigo-500/25 hover:-translate-y-0.5 transition"
              >
                Browse Guides <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/scholarships"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full glass hover:bg-white/80 text-slate-800 font-semibold hover:text-indigo-700 transition"
              >
                <Sparkles className="w-4 h-4 text-purple-500" />
                Explore Scholarships
              </Link>
            </div>

            <div className="mt-10 grid grid-cols-3 gap-4 max-w-md">
              <Stat value="120+" label="Guides" />
              <Stat value="100%" label="Official links" />
              <Stat value="0₹" label="Cost to you" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="relative h-[520px] hidden lg:block"
          >
            <HeroIllustration />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Stat({
  value,
  label
}) {
  return (
    <div className="glass rounded-2xl px-3 py-2.5">
      <div className="text-2xl font-extrabold text-slate-900">{value}</div>
      <div className="text-[11px] text-slate-500 font-medium mt-0.5">{label}</div>
    </div>
  );
}

function HeroIllustration() {
  return (
    <div className="relative w-full h-full">
      {/* Central guide card */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-96 rounded-3xl brand-gradient shadow-2xl shadow-indigo-500/40 p-6 text-white overflow-hidden gradient-border"
      >
        <div className="flex items-center gap-2 mb-6">
          <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center backdrop-blur">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs opacity-80">Guide</div>
            <div className="font-semibold">Aadhaar Card</div>
          </div>
          <div className="ml-auto text-[10px] px-2 py-1 rounded-full bg-white/20 font-semibold">STEP-BY-STEP</div>
        </div>

        <div className="space-y-3 text-sm">
          <Row label="Issued by" value="UIDAI" />
          <Row label="Fees" value="Free · ₹50 update" />
          <Row label="Time" value="7 – 30 days" />
          <Row label="Docs" value="ID · Address · DOB" />
        </div>

        <div className="mt-6 p-3 rounded-2xl bg-white/20 backdrop-blur border border-white/30">
          <div className="text-[11px] opacity-90 mb-1">4-step process</div>
          <div className="flex items-end justify-between">
            <div className="text-3xl font-bold">4</div>
            <div className="text-xs opacity-90 flex items-center gap-1">
              <ExternalLink className="w-3 h-3" /> uidai.gov.in
            </div>
          </div>
          <div className="mt-2 h-1.5 rounded-full bg-white/25 overflow-hidden">
            <div className="h-full w-full bg-white rounded-full" />
          </div>
        </div>

        <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-white/10" />
      </motion.div>

      {/* Scholarship card */}
      <motion.div
        animate={{ y: [0, 12, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
        className="absolute top-4 right-4 w-56 glass-strong rounded-2xl p-4"
      >
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-slate-500 font-medium">Scheme</div>
            <div className="text-sm font-semibold text-slate-900">Ayushman Bharat</div>
          </div>
        </div>
        <div className="mt-3 text-xs text-slate-500">Free health cover</div>
        <div className="text-lg font-extrabold brand-gradient-text">₹5,00,000/yr</div>
      </motion.div>

      {/* AI assistant card */}
      <motion.div
        animate={{ y: [0, -14, 0] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
        className="absolute bottom-8 left-0 w-64 glass-strong rounded-2xl p-4"
      >
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-slate-500 font-medium">Sathi AI</div>
            <div className="text-sm font-semibold text-slate-900">How do I get a PAN?</div>
          </div>
        </div>
        <div className="mt-3 text-xs text-slate-600 bg-white/60 rounded-xl p-2.5 leading-relaxed border border-white/70">
          "Use the free e-PAN service at incometax.gov.in — it takes 48 hours…"
        </div>
      </motion.div>

      {/* Women safety */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
        className="absolute top-24 -left-2 w-40 glass-strong rounded-2xl p-3.5"
      >
        <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
          <ShieldAlert className="w-5 h-5" />
        </div>
        <div className="mt-2 text-xs text-slate-500">Women Helpline</div>
        <div className="text-sm font-semibold text-slate-900">112 · 1091</div>
        <div className="mt-1 text-[10px] text-emerald-600 font-semibold">24×7 free</div>
      </motion.div>

      {/* Learning */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 5.2, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
        className="absolute bottom-2 right-6 w-48 glass-strong rounded-2xl p-3.5"
      >
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-slate-500">Free Learning</div>
            <div className="text-sm font-semibold text-slate-900">SWAYAM · NPTEL</div>
          </div>
        </div>
      </motion.div>

      {/* Verified badge */}
      <motion.div
        animate={{ rotate: [0, 6, -6, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute top-2 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full glass-strong flex items-center gap-1.5 text-xs font-semibold text-slate-700"
      >
        <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
        Official links only
      </motion.div>
    </div>
  );
}

function Row({
  label,
  value
}) {
  return (
    <div className="flex justify-between">
      <span className="opacity-80">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}
