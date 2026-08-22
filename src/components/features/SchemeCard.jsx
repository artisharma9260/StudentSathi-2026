import { motion } from "framer-motion";
import {
  Calendar,
  Award,
  ExternalLink,
  Bookmark,
  BookmarkCheck,
  Share2,
  Building2,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function SchemeCard({
  scheme,
  index = 0,
  isSaved = false,
  onToggleSave
}) {
  const handleSave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleSave?.(scheme.id, scheme.name);
  };

  const handleShare = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const shareData = {
      title: scheme.name,
      text: `${scheme.name} — ${scheme.benefit}`,
      url: scheme.officialUrl,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(`${scheme.name}: ${scheme.officialUrl}`);
        toast.success("Link copied to clipboard");
      }
    } catch {
      /* user cancelled */
    }
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ delay: index * 0.04, duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
      className="group relative glass-card glass-hover gradient-border rounded-3xl p-5 flex flex-col"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner",
              scheme.color
            )}
          >
            <Award className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-indigo-600">
              <Building2 className="w-3 h-3" />
              <span className="truncate">{scheme.department}</span>
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              Updated {new Date(scheme.updatedAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={handleShare}
            aria-label="Share scheme"
            className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 hover:text-indigo-600 hover:bg-white/70 transition"
          >
            <Share2 className="w-4 h-4" />
          </button>
          <button
            onClick={handleSave}
            aria-label={isSaved ? "Remove bookmark" : "Bookmark scheme"}
            aria-pressed={isSaved}
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

      <h3 className="mt-4 text-lg font-bold text-slate-900 leading-snug line-clamp-2">
        {scheme.name}
      </h3>
      <p className="mt-1.5 text-sm text-slate-600 line-clamp-2">{scheme.description}</p>

      <div className="mt-3 flex flex-wrap gap-1.5">
        <Tag color="indigo">{scheme.category}</Tag>
        <Tag color="slate">{scheme.state}</Tag>
        <Tag color="emerald">{scheme.education}</Tag>
        {scheme.tags?.slice(0, 2).map((t) => (
          <Tag key={t} color="sky">{t}</Tag>
        ))}
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-2 text-xs">
        <div className="rounded-xl bg-white/60 border border-white/70 p-2.5 backdrop-blur">
          <dt className="text-slate-500 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-indigo-500" /> Benefit
          </dt>
          <dd className="font-semibold text-slate-900 mt-0.5">{scheme.benefit}</dd>
        </div>
        <div className="rounded-xl bg-white/60 border border-white/70 p-2.5 backdrop-blur">
          <dt className="text-slate-500">Eligibility</dt>
          <dd className="font-semibold text-slate-900 mt-0.5 line-clamp-2">{scheme.eligibility}</dd>
        </div>
      </dl>

      <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
        <Calendar className="w-3.5 h-3.5" />
        <span>
          Deadline: <span className="font-semibold text-slate-800">{scheme.deadline}</span>
        </span>
      </div>

      <div className="mt-4 pt-4 border-t border-white/70 flex items-center gap-2">
        <a
          href={scheme.officialUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 inline-flex items-center justify-center gap-1.5 h-10 rounded-xl bg-white/70 hover:bg-white border border-white/80 text-slate-700 hover:text-indigo-700 font-semibold text-xs transition"
        >
          <ExternalLink className="w-3.5 h-3.5" /> Official Site
        </a>
        <a
          href={scheme.officialUrl}
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

function Tag({
  children,
  color
}) {
  const map = {
    indigo: "bg-indigo-50 text-indigo-700 border-indigo-100",
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-100",
    slate: "bg-slate-100 text-slate-600 border-slate-200",
    sky: "bg-sky-50 text-sky-700 border-sky-100",
  };
  return (
    <span
      className={cn(
        "text-[10px] px-2 py-0.5 rounded-full font-semibold border",
        map[color]
      )}
    >
      {children}
    </span>
  );
}
