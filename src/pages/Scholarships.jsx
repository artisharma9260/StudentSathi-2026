import { useState, useMemo } from "react";
import { Search, Filter, ExternalLink, Calendar, GraduationCap, Sparkles, Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import PageHeader from "@/components/features/PageHeader";
import { useScholarships } from "@/hooks/useScholarships";
import { cn } from "@/lib/utils";

const typeFilters = ["All", "Government", "Private", "International"];

const GOV_KEYWORDS = [
  "govt", "government", "ministry", "aicte", "dst", "ugc", "nsp",
  "ncert", "csir", "dbt", "ssc", "state", "iisc",
];

function inferType(provider = "") {
  const p = provider.toLowerCase();
  if (p.includes("international") || p.includes("fulbright") || p.includes("commonwealth") || p.includes("chevening")) {
    return "International";
  }
  if (GOV_KEYWORDS.some((k) => p.includes(k))) return "Government";
  return "Private";
}

function hash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h << 5) - h + str.charCodeAt(i);
  return h;
}

const PALETTES = [
  "bg-emerald-100 text-emerald-700",
  "bg-indigo-100 text-indigo-700",
  "bg-pink-100 text-pink-700",
  "bg-blue-100 text-blue-700",
  "bg-slate-100 text-slate-700",
  "bg-sky-100 text-sky-700",
  "bg-orange-100 text-orange-700",
];

function formatAmount(amount, currency) {
  if (amount == null) return "See details";
  const symbol = currency === "INR" || !currency ? "₹" : currency + " ";
  return `${symbol}${Number(amount).toLocaleString("en-IN")} / year`;
}

function formatDeadline(deadline) {
  if (!deadline) return "Rolling / Ongoing";
  const d = new Date(deadline);
  if (Number.isNaN(d.getTime())) return String(deadline);
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

// Maps the backend Scholarship document shape to the shape this page's UI expects.
function adapt(s) {
  const id = s._id || s.id;
  const type = s.type || inferType(s.provider);
  const tags = s.tags || [
    s.educationLevel && s.educationLevel !== "any" ? s.educationLevel : null,
    s.state && s.state !== "All India" ? s.state : "All India",
  ].filter(Boolean);

  return {
    id,
    name: s.title || s.name,
    provider: s.provider,
    type,
    amount: typeof s.amount === "number" ? formatAmount(s.amount, s.currency) : s.amount,
    deadline: formatDeadline(s.deadline),
    eligibility: s.eligibility,
    description: s.description || s.eligibility,
    officialUrl: s.officialLink || s.officialUrl,
    tags,
    color: s.color || PALETTES[Math.abs(hash(String(id))) % PALETTES.length],
  };
}

export default function Scholarships() {
  const [q, setQ] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [type, setType] = useState("All");

  const { data, isLoading, isFetching, isError, refetch } = useScholarships({ q: searchTerm, limit: 60 });

  const liveItems = useMemo(() => (data?.items ?? []).map(adapt), [data]);

  const filtered = useMemo(
    () => liveItems.filter((s) => type === "All" || s.type === type),
    [liveItems, type]
  );

  const runSearch = () => setSearchTerm(q.trim());

  return (
    <>
      <PageHeader
        eyebrow="SCHOLARSHIPS · LIVE AI SEARCH"
        title="Fund your education, unlock your future"
        description="Our AI searches the live web (Gemini + Google Search) for current scholarships — government, private and international — with direct links to official portals."
      >
        <div className="mt-4 flex items-center gap-2 glass-strong rounded-2xl p-2 max-w-2xl">
          <div className="pl-2 text-slate-400"><Search className="w-5 h-5" /></div>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && runSearch()}
            placeholder="e.g. BTech scholarships for girls, MP state, income below 3L…"
            className="flex-1 h-11 bg-transparent text-sm focus:outline-none"
          />
          <button
            onClick={runSearch}
            disabled={isFetching}
            className="h-11 px-5 rounded-xl brand-gradient text-white font-semibold text-sm disabled:opacity-60"
          >
            {isFetching ? <Loader2 className="w-4 h-4 animate-spin" /> : "Search"}
          </button>
        </div>
      </PageHeader>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16">
        {isError && (
          <div className="mb-6 rounded-2xl bg-amber-50/80 backdrop-blur border border-amber-100 text-amber-800 px-4 py-3 text-sm flex items-start justify-between gap-3">
            <span className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-none" />
              Couldn't fetch live scholarships right now. This can happen if the AI search is briefly rate-limited.
            </span>
            <button
              onClick={() => refetch()}
              className="inline-flex items-center gap-1 text-xs font-semibold text-amber-900 hover:underline flex-none"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Retry
            </button>
          </div>
        )}

        <div className="mb-6 glass-card p-3 flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 pr-2 border-r border-white/70">
            <Filter className="w-4 h-4 text-indigo-600" /> Type
          </div>
          {typeFilters.map((t) => (
            <button
              key={t}
              onClick={() => setType(t)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-semibold transition",
                type === t ? "brand-gradient text-white shadow-md" : "bg-white/60 text-slate-600 hover:bg-white"
              )}
            >
              {t}
            </button>
          ))}
          <div className="ml-auto text-sm text-slate-500">
            {isLoading ? (
              <span className="inline-flex items-center gap-1"><Loader2 className="w-3.5 h-3.5 animate-spin" /> Searching the web…</span>
            ) : (
              <>
                <span className="font-semibold text-slate-900">{filtered.length}</span> scholarships found live
              </>
            )}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((s, i) => (
            <ScholarshipCard key={s.id} sch={s} index={i} />
          ))}
          {!isLoading && !isError && filtered.length === 0 && (
            <div className="col-span-full text-center py-20 text-slate-500">
              No scholarships found for this search. Try different keywords or clear the filter.
            </div>
          )}
        </div>
      </section>
    </>
  );
}

function ScholarshipCard({
  sch,
  index
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ delay: index * 0.04, duration: 0.5 }}
      className="glass-card glass-hover gradient-border rounded-3xl p-5 flex flex-col"
    >
      <div className="flex items-start justify-between">
        <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", sch.color)}>
          <GraduationCap className="w-5 h-5" />
        </div>
        <span className={cn(
          "text-[10px] px-2 py-0.5 rounded-full font-bold border",
          sch.type === "Government" && "bg-emerald-50 text-emerald-700 border-emerald-100",
          sch.type === "Private" && "bg-indigo-50 text-indigo-700 border-indigo-100",
          sch.type === "International" && "bg-sky-50 text-sky-700 border-sky-100",
        )}>
          {sch.type}
        </span>
      </div>
      <h3 className="mt-4 text-lg font-bold text-slate-900 leading-snug">{sch.name}</h3>
      <div className="text-xs text-slate-500 mt-1">{sch.provider}</div>
      <p className="mt-2 text-sm text-slate-600 line-clamp-2">{sch.description}</p>

      <dl className="mt-4 grid grid-cols-2 gap-2 text-xs">
        <div className="rounded-xl bg-white/60 border border-white/70 p-2.5">
          <dt className="text-slate-500 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-indigo-500" /> Amount
          </dt>
          <dd className="font-semibold text-slate-900 mt-0.5">{sch.amount}</dd>
        </div>
        <div className="rounded-xl bg-white/60 border border-white/70 p-2.5">
          <dt className="text-slate-500">Eligibility</dt>
          <dd className="font-semibold text-slate-900 mt-0.5 line-clamp-2">{sch.eligibility}</dd>
        </div>
      </dl>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {(sch.tags || []).map((t) => (
          <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold">
            {t}
          </span>
        ))}
      </div>

      <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
        <Calendar className="w-3.5 h-3.5" /> Deadline:
        <span className="font-semibold text-slate-800">{sch.deadline}</span>
      </div>

      <div className="mt-4 pt-4 border-t border-white/70 flex items-center gap-2">
        <a
          href={sch.officialUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 inline-flex items-center justify-center gap-1.5 h-10 rounded-xl bg-white/70 hover:bg-white border border-white/80 text-slate-700 hover:text-indigo-700 font-semibold text-xs transition"
        >
          <ExternalLink className="w-3.5 h-3.5" /> Official Site
        </a>
        <a
          href={sch.officialUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 inline-flex items-center justify-center gap-1.5 h-10 rounded-xl brand-gradient text-white font-semibold text-xs shadow-md hover:shadow-lg hover:-translate-y-0.5 transition"
        >
          Apply Now
        </a>
      </div>
    </motion.article>
  );
}
