import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, Filter, Loader2, AlertCircle, RefreshCw } from "lucide-react";
import PageHeader from "@/components/features/PageHeader";
import SchemeCard from "@/components/features/SchemeCard";
import { stateOptions, categoryOptions, eduOptions, genderOptions } from "@/data/schemeFilters";
import { useSchemes } from "@/hooks/useSchemes";
import { useSavedSchemes } from "@/hooks/useSavedSchemes";

function adapt(s) {
  const palettes = [
    "bg-blue-100 text-blue-700",
    "bg-emerald-100 text-emerald-700",
    "bg-purple-100 text-purple-700",
    "bg-orange-100 text-orange-700",
    "bg-pink-100 text-pink-700",
    "bg-sky-100 text-sky-700",
  ];
  const color = palettes[Math.abs(hash(s._id)) % palettes.length];
  return {
    id: s._id,
    name: s.title,
    category: s.category || "Scholarship",
    department: (s).department || "Government of India",
    state: s.state || "All India",
    education: s.educationLevel || "All",
    gender: (s.gender) || "All",
    benefit: s.benefits || "—",
    eligibility: s.eligibility || "See details",
    deadline: s.deadline ? new Date(s.deadline).toLocaleDateString() : "Ongoing",
    description: s.description || "",
    documents: s.requiredDocuments || [],
    color,
    officialUrl: (s).officialUrl || "https://www.india.gov.in",
    tags: (s).tags || [],
    updatedAt: (s).updatedAt || new Date().toISOString(),
  };
}

function hash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h << 5) - h + str.charCodeAt(i);
  return h;
}

export default function Schemes() {
  const [searchParams] = useSearchParams();
  const initialQ = searchParams.get("q") || "";
  const [q, setQ] = useState(initialQ);
  const [state, setState] = useState("All India");
  const [cat, setCat] = useState("All");
  const [edu, setEdu] = useState("All");
  const [gen, setGen] = useState("All");

  useEffect(() => {
    setQ(searchParams.get("q") || "");
  }, [searchParams]);

  const { savedIds, toggle } = useSavedSchemes();

  const { data, isLoading, isError, refetch } = useSchemes({
    q,
    state,
    category: cat,
    educationLevel: edu,
    gender: gen,
    limit: 24,
  });

  const filtered = useMemo(() => (data?.items ?? []).map(adapt), [data]);

  return (
    <>
      <PageHeader
        eyebrow="SCHEME GUIDES"
        title="Every major government scheme, explained"
        description="Learn what each scheme is, who can apply, benefits and required documents — with direct links to official government portals. StudentSathi guides you; you apply on the official site."
      >
        <div className="mt-2 flex items-center gap-2 glass-strong rounded-2xl p-2 max-w-2xl shadow-lg">
          <div className="pl-3 text-slate-400"><Search className="w-5 h-5" /></div>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search PM Kisan, Ayushman Bharat, scholarships…"
            className="flex-1 h-11 bg-transparent text-sm focus:outline-none"
          />
          <button className="h-11 px-5 rounded-xl brand-gradient text-white font-semibold text-sm shadow-md">Search</button>
        </div>
      </PageHeader>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16">
        {isError && (
          <div className="mb-6 rounded-2xl bg-amber-50/80 backdrop-blur border border-amber-100 text-amber-800 px-4 py-3 text-sm flex items-start justify-between gap-3">
            <span className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-none" />
              Couldn't load schemes right now. Please check your connection and try again.
            </span>
            <button
              onClick={() => refetch()}
              className="inline-flex items-center gap-1 text-xs font-semibold text-amber-900 hover:underline flex-none"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Retry
            </button>
          </div>
        )}

        <div className="mb-6 glass-card p-4 flex flex-wrap gap-3 items-center sticky top-20 z-20">
          <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 pr-2 border-r border-white/70">
            <Filter className="w-4 h-4 text-indigo-600" /> Filters
          </div>
          <Select label="State" value={state} onChange={setState} options={stateOptions} />
          <Select label="Category" value={cat} onChange={setCat} options={categoryOptions} />
          <Select label="Education" value={edu} onChange={setEdu} options={eduOptions} />
          <Select label="Gender" value={gen} onChange={setGen} options={genderOptions} />
          <div className="ml-auto text-sm text-slate-500">
            {isLoading ? (
              <span className="inline-flex items-center gap-1"><Loader2 className="w-3.5 h-3.5 animate-spin" /> Loading…</span>
            ) : (
              <>
                <span className="font-semibold text-slate-900">{filtered.length}</span> schemes found
              </>
            )}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((s, i) => (
            <SchemeCard
              key={s.id}
              scheme={s}
              index={i}
              isSaved={savedIds.has(s.id)}
              onToggleSave={toggle}
            />
          ))}
          {!isLoading && filtered.length === 0 && (
            <div className="col-span-full text-center py-20 text-slate-500">
              No schemes match your filters. Try clearing them.
            </div>
          )}
        </div>
      </section>
    </>
  );
}

function Select({
  label,
  value,
  onChange,
  options
}) {
  return (
    <label className="flex items-center gap-2 text-sm">
      <span className="text-slate-500">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg border border-white/70 bg-white/70 backdrop-blur px-3 py-1.5 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-200"
      >
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </label>
  );
}
