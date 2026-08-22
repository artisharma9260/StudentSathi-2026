import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Filter, ArrowRight, ExternalLink, Bookmark, BookmarkCheck, Share2 } from "lucide-react";
import PageHeader from "@/components/features/PageHeader";
import { documentGuides, guideCategories } from "@/data/documentGuides";
import { useSavedSchemes } from "@/hooks/useSavedSchemes";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function Documents() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const { savedIds, toggle } = useSavedSchemes();

  const filtered = useMemo(() => {
    return documentGuides.filter((g) => {
      if (cat !== "All" && g.category !== cat) return false;
      if (q && !`${g.name} ${g.short} ${g.authority} ${g.category}`.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
  }, [q, cat]);

  const share = async (g, e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      if (navigator.share) await navigator.share({ title: g.name, text: g.short, url: g.officialUrl });
      else {
        await navigator.clipboard.writeText(`${g.name}: ${window.location.origin}/documents/${g.slug}`);
        toast.success("Link copied");
      }
    } catch {
      /* cancelled */
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="DOCUMENT GUIDES"
        title="Every government document — decoded, step by step"
        description="A guidance portal that explains what each document is, why it's needed, required papers, fees, timelines and how to apply on the official portal."
      >
        <div className="mt-2 flex items-center gap-2 glass-strong rounded-2xl p-2 max-w-2xl shadow-lg">
          <div className="pl-3 text-slate-400">
            <Search className="w-5 h-5" />
          </div>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search Aadhaar, PAN, Passport, Ration Card…"
            className="flex-1 h-11 bg-transparent text-sm focus:outline-none"
          />
        </div>
      </PageHeader>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16">
        <div className="mb-6 glass-card p-3 flex flex-wrap items-center gap-2 sticky top-20 z-20">
          <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 pr-2 border-r border-white/70">
            <Filter className="w-4 h-4 text-indigo-600" /> Category
          </div>
          {(["All", ...guideCategories]).map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-semibold transition",
                cat === c ? "brand-gradient text-white shadow-md" : "bg-white/60 text-slate-600 hover:bg-white"
              )}
            >
              {c}
            </button>
          ))}
          <div className="ml-auto text-sm text-slate-500">
            <span className="font-semibold text-slate-900">{filtered.length}</span> guides
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((g, i) => {
            const Icon = g.Icon;
            const isSaved = savedIds.has(g.id);
            return (
              <motion.article
                key={g.id}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ delay: i * 0.03, duration: 0.5 }}
                className="glass-card glass-hover gradient-border rounded-3xl p-5 flex flex-col"
              >
                <div className="flex items-start justify-between">
                  <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner", g.color)}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => share(g, e)}
                      aria-label="Share guide"
                      className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 hover:text-indigo-600 hover:bg-white/70 transition"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggle(g.id, g.name);
                      }}
                      aria-label={isSaved ? "Remove bookmark" : "Bookmark guide"}
                      className={cn(
                        "w-9 h-9 rounded-xl flex items-center justify-center transition",
                        isSaved
                          ? "bg-indigo-50 text-indigo-600 ring-1 ring-indigo-100"
                          : "text-slate-500 hover:text-indigo-600 hover:bg-white/70"
                      )}
                    >
                      {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-1.5">
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold border bg-indigo-50 text-indigo-700 border-indigo-100 uppercase tracking-wider">
                    {g.category}
                  </span>
                  <span className="text-[10px] text-slate-500 truncate">{g.authority.split(" · ")[0]}</span>
                </div>
                <h3 className="mt-2 text-lg font-bold text-slate-900 leading-snug line-clamp-2">{g.name}</h3>
                <p className="mt-1.5 text-sm text-slate-600 line-clamp-2 flex-1">{g.short}</p>

                <dl className="mt-4 grid grid-cols-2 gap-2 text-xs">
                  <div className="rounded-xl bg-white/60 border border-white/70 p-2.5">
                    <dt className="text-slate-500">Fees</dt>
                    <dd className="font-semibold text-slate-900 mt-0.5 line-clamp-1">{g.fees}</dd>
                  </div>
                  <div className="rounded-xl bg-white/60 border border-white/70 p-2.5">
                    <dt className="text-slate-500">Time</dt>
                    <dd className="font-semibold text-slate-900 mt-0.5 line-clamp-1">{g.time}</dd>
                  </div>
                </dl>

                <div className="mt-4 pt-4 border-t border-white/70 flex items-center gap-2">
                  <Link
                    to={`/documents/${g.slug}`}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 h-10 rounded-xl brand-gradient text-white font-semibold text-xs shadow-md hover:shadow-lg hover:-translate-y-0.5 transition"
                  >
                    Read Guide <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <a
                    href={g.officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-1.5 h-10 rounded-xl bg-white/70 hover:bg-white border border-white/80 text-slate-700 hover:text-indigo-700 font-semibold text-xs transition"
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> Official Site
                  </a>
                </div>
              </motion.article>
            );
          })}
          {filtered.length === 0 && (
            <div className="col-span-full text-center py-20 text-slate-500">
              No guides match your search.
            </div>
          )}
        </div>
      </section>
    </>
  );
}
