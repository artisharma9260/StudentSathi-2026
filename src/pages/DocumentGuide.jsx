import { useMemo } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ExternalLink,
  CheckCircle2,
  Clock,
  IndianRupee,
  ShieldCheck,
  Lightbulb,
  AlertTriangle,
  HelpCircle,
  Share2,
  Bookmark,
  BookmarkCheck,
} from "lucide-react";
import { getGuideBySlug, documentGuides } from "@/data/documentGuides";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useSavedSchemes } from "@/hooks/useSavedSchemes";

export default function DocumentGuide() {
  const { slug = "" } = useParams();
  const guide = useMemo(() => getGuideBySlug(slug), [slug]);
  const { savedIds, toggle } = useSavedSchemes();

  if (!guide) {
    return <Navigate to="/documents" replace />;
  }

  const saved = savedIds.has(guide.id);

  const related = documentGuides
    .filter((g) => g.category === guide.category && g.id !== guide.id)
    .slice(0, 3);

  const share = async () => {
    const shareData = {
      title: guide.name,
      text: `${guide.name} — ${guide.short}`,
      url: guide.officialUrl,
    };
    try {
      if (navigator.share) await navigator.share(shareData);
      else {
        await navigator.clipboard.writeText(`${guide.name}: ${guide.officialUrl}`);
        toast.success("Link copied");
      }
    } catch {
      /* cancelled */
    }
  };

  const Icon = guide.Icon;

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute -top-24 -right-16 w-96 h-96 rounded-full bg-purple-300/30 blur-3xl" />
        <div className="absolute -bottom-16 -left-16 w-96 h-96 rounded-full bg-indigo-300/30 blur-3xl" />
        <div className="absolute inset-0 pattern-dots opacity-50" />

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-8 pb-14">
          <Link
            to="/documents"
            className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-700 hover:text-indigo-900 mb-6"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Documents
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card gradient-border rounded-3xl p-6 sm:p-8"
          >
            <div className="flex flex-col md:flex-row gap-6 md:items-start">
              <div
                className={cn(
                  "w-16 h-16 md:w-20 md:h-20 rounded-3xl flex items-center justify-center shadow-inner flex-none",
                  guide.color
                )}
              >
                <Icon className="w-8 h-8" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold border bg-indigo-50 text-indigo-700 border-indigo-100 uppercase tracking-wider">
                    {guide.category}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">{guide.authority}</span>
                </div>
                <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                  {guide.name}
                </h1>
                <p className="mt-3 text-slate-600 leading-relaxed max-w-3xl">{guide.short}</p>

                <div className="mt-5 grid sm:grid-cols-3 gap-3 max-w-2xl">
                  <MetaTile icon={<IndianRupee className="w-4 h-4" />} label="Fees" value={guide.fees} />
                  <MetaTile icon={<Clock className="w-4 h-4" />} label="Time" value={guide.time} />
                  <MetaTile icon={<ShieldCheck className="w-4 h-4" />} label="Issued by" value={guide.authority.split(" · ")[0]} />
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-2">
              <a
                href={guide.officialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 h-11 px-5 rounded-full brand-gradient text-white font-semibold shadow-md hover:-translate-y-0.5 transition text-sm"
              >
                <ExternalLink className="w-4 h-4" /> Visit Official Website
              </a>
              <button
                onClick={() => {
                  toggle(guide.id, guide.name);
                }}
                className={cn(
                  "inline-flex items-center gap-2 h-11 px-4 rounded-full font-semibold text-sm transition",
                  saved
                    ? "bg-indigo-50 text-indigo-700 border border-indigo-100"
                    : "glass hover:bg-white/80 text-slate-700"
                )}
              >
                {saved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                {saved ? "Saved" : "Save Guide"}
              </button>
              <button
                onClick={share}
                className="inline-flex items-center gap-2 h-11 px-4 rounded-full glass hover:bg-white/80 text-slate-700 font-semibold text-sm"
              >
                <Share2 className="w-4 h-4" /> Share
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Purpose + Eligibility */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pb-10">
        <div className="grid lg:grid-cols-3 gap-6">
          <Card title="What is it?" className="lg:col-span-2">
            <p className="text-slate-700 leading-relaxed text-[15px]">{guide.purpose}</p>
          </Card>
          <Card title="Who can apply?">
            <ul className="space-y-2.5">
              {guide.eligibility.map((e, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-500 flex-none" />
                  <span>{e}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        {/* Documents + Steps */}
        <div className="mt-6 grid lg:grid-cols-2 gap-6">
          <Card title="Documents required">
            <ul className="space-y-2.5">
              {guide.documents.map((d, i) => (
                <li key={i} className="flex items-start gap-2.5 rounded-xl bg-white/60 border border-white/70 p-3 backdrop-blur">
                  <div className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center justify-center flex-none">
                    {i + 1}
                  </div>
                  <span className="text-sm text-slate-800">{d}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card title="Step-by-step procedure">
            <ol className="relative border-l-2 border-indigo-100 ml-3 space-y-5">
              {guide.steps.map((s, i) => (
                <li key={i} className="pl-6">
                  <div className="absolute -left-3.5 w-7 h-7 rounded-full brand-gradient text-white text-xs font-bold flex items-center justify-center shadow">
                    {i + 1}
                  </div>
                  <div className="text-sm font-semibold text-slate-900">Step {i + 1}</div>
                  <div className="text-sm text-slate-600 leading-relaxed mt-0.5">{s}</div>
                </li>
              ))}
            </ol>
          </Card>
        </div>

        {/* Tips + mistakes */}
        <div className="mt-6 grid lg:grid-cols-2 gap-6">
          <Card title="Pro tips" accent="emerald">
            <ul className="space-y-2.5">
              {guide.tips.map((t, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                  <Lightbulb className="w-4 h-4 mt-0.5 text-emerald-500 flex-none" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </Card>
          <Card title="Common mistakes" accent="rose">
            <ul className="space-y-2.5">
              {guide.mistakes.map((m, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                  <AlertTriangle className="w-4 h-4 mt-0.5 text-rose-500 flex-none" />
                  <span>{m}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        {/* FAQs */}
        <div className="mt-6">
          <Card title="Frequently Asked Questions" accent="indigo">
            <div className="divide-y divide-white/70">
              {guide.faqs.map((f, i) => (
                <details key={i} className="py-3 group">
                  <summary className="flex items-start gap-2 cursor-pointer list-none">
                    <HelpCircle className="w-4 h-4 mt-0.5 text-indigo-500 flex-none" />
                    <span className="text-sm font-semibold text-slate-900 group-open:text-indigo-700">{f.q}</span>
                  </summary>
                  <div className="mt-2 pl-6 text-sm text-slate-600 leading-relaxed">{f.a}</div>
                </details>
              ))}
            </div>
          </Card>
        </div>

        {/* Callout */}
        <div className="mt-8 glass-card gradient-border rounded-3xl p-6 flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1">
            <div className="text-xs font-bold text-indigo-700 uppercase tracking-wider">Ready to apply?</div>
            <h3 className="mt-1 text-xl font-bold text-slate-900">Complete the application on the official government website</h3>
            <p className="mt-1 text-sm text-slate-600">
              StudentSathi is a guidance portal — you must apply directly on the official government portal linked below.
            </p>
          </div>
          <a
            href={guide.officialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 h-11 px-5 rounded-full brand-gradient text-white font-semibold shadow-md hover:-translate-y-0.5 transition text-sm"
          >
            <ExternalLink className="w-4 h-4" /> Open Official Portal
          </a>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-10">
            <div className="flex items-end justify-between mb-4">
              <h2 className="text-xl font-extrabold text-slate-900">Related guides</h2>
              <Link to="/documents" className="text-sm font-semibold text-indigo-700 hover:text-indigo-900">
                All guides →
              </Link>
            </div>
            <div className="grid sm:grid-cols-3 gap-5">
              {related.map((r) => {
                const RIcon = r.Icon;
                return (
                  <Link
                    key={r.id}
                    to={`/documents/${r.slug}`}
                    className="glass-card glass-hover rounded-3xl p-5"
                  >
                    <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center", r.color)}>
                      <RIcon className="w-5 h-5" />
                    </div>
                    <h3 className="mt-3 font-bold text-slate-900">{r.name}</h3>
                    <p className="mt-1 text-xs text-slate-500 line-clamp-2">{r.short}</p>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </section>
    </>
  );
}

function MetaTile({
  icon,
  label,
  value
}) {
  return (
    <div className="glass rounded-2xl px-3 py-2.5">
      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
        <span className="text-indigo-600">{icon}</span> {label}
      </div>
      <div className="text-sm font-semibold text-slate-900 mt-0.5 leading-snug">{value}</div>
    </div>
  );
}

function Card({
  title,
  children,
  className,
  accent = "indigo"
}) {
  const dot = {
    indigo: "bg-indigo-500",
    emerald: "bg-emerald-500",
    rose: "bg-rose-500",
  }[accent];
  return (
    <div className={cn("glass-card rounded-3xl p-5 sm:p-6", className)}>
      <div className="flex items-center gap-2 mb-4">
        <span className={cn("w-2 h-2 rounded-full", dot)} />
        <h2 className="text-base font-bold text-slate-900">{title}</h2>
      </div>
      {children}
    </div>
  );
}
