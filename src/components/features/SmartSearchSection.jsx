import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Search, Award, Briefcase, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";

const examples = [
  "BTech from MP, income < 3L, need scholarships",
  "12th passed girl student in Bihar, want free coaching",
  "CSE 3rd year, remote internship in AI",
];

export default function SmartSearchSection() {
  const [q, setQ] = useState("");
  const [show, setShow] = useState(false);
  const nav = useNavigate();

  const run = (text) => {
    setQ(text);
    setShow(true);
  };

  return (
    <section className="relative py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 p-8 sm:p-12 overflow-hidden shadow-xl"
        >
          <div className="absolute -top-10 -right-10 w-64 h-64 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-10 -left-10 w-64 h-64 rounded-full bg-white/10 blur-2xl" />

          <div className="relative text-center text-white">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              AI Smart Search
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold">Describe your situation in plain English</h2>
            <p className="mt-3 text-white/85 max-w-2xl mx-auto">
              Skip the filters. Just type who you are and what you're looking for — Sathi AI will surface the best-matched opportunities.
            </p>

            <div className="mt-8 flex items-center gap-2 bg-white rounded-2xl p-2 shadow-2xl max-w-3xl mx-auto">
              <div className="pl-3 text-blue-600">
                <Search className="w-5 h-5" />
              </div>
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="e.g. BTech student from MP, family income below 3 lakh, need scholarships"
                className="flex-1 h-12 bg-transparent text-slate-900 text-sm sm:text-base focus:outline-none placeholder:text-slate-400"
              />
              <button
                onClick={() => setShow(true)}
                className="h-12 px-5 rounded-xl brand-gradient text-white font-semibold flex items-center gap-1.5 hover:opacity-95 transition"
              >
                <Sparkles className="w-4 h-4" /> Search
              </button>
            </div>

            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {examples.map((e) => (
                <button
                  key={e}
                  onClick={() => run(e)}
                  className="text-xs px-3 py-1.5 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur border border-white/20"
                >
                  {e}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {show && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 grid sm:grid-cols-3 gap-4"
          >
            <ResultCard color="green" Icon={Award} title="PM Vidyalaxmi" tag="Scholarship" match={92} onClick={() => nav("/scholarships")} />
            <ResultCard color="sky" Icon={Briefcase} title="National Scholarship Portal" tag="Scholarship" match={87} onClick={() => nav("/scholarships")} />
            <ResultCard color="purple" Icon={BookOpen} title="Aadhaar Card Guide" tag="Document" match={81} onClick={() => nav("/documents")} />
          </motion.div>
        )}
      </div>
    </section>
  );
}

function ResultCard({
  color,
  Icon,
  title,
  tag,
  match,
  onClick
}) {
  const colors = {
    green: "bg-green-50 text-green-600",
    sky: "bg-sky-50 text-sky-600",
    purple: "bg-purple-50 text-purple-600",
  };
  const bars = {
    green: "bg-green-500",
    sky: "bg-sky-500",
    purple: "bg-purple-500",
  };
  return (
    <button
      onClick={onClick}
      className="text-left bg-white rounded-2xl border border-slate-100 p-5 hover:-translate-y-1 hover:shadow-xl transition-all"
    >
      <div className="flex items-center justify-between">
        <div className={`w-10 h-10 rounded-xl ${colors[color]} flex items-center justify-center`}>
          <Icon className="w-5 h-5" />
        </div>
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{tag}</span>
      </div>
      <h3 className="mt-3 font-semibold text-slate-900">{title}</h3>
      <div className="mt-3 flex items-center gap-2">
        <div className="flex-1 h-1.5 rounded-full bg-slate-100">
          <div className={`h-full rounded-full ${bars[color]}`} style={{ width: `${match}%` }} />
        </div>
        <span className="text-xs font-bold text-slate-700">{match}%</span>
      </div>
    </button>
  );
}
