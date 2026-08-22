import { motion } from "framer-motion";
import {
  Phone,
  Shield,
  MapPin,
  ShieldAlert,
  Landmark,
  ExternalLink,
  Heart,
  Baby,
  Smartphone,
  Scale,
} from "lucide-react";
import PageHeader from "@/components/features/PageHeader";
import { helplines, womenPortals, rights, safetyApps } from "@/data/womenSafety";
import { cn } from "@/lib/utils";

const iconMap = {
  ShieldAlert,
  MapPin,
  Shield,
  Landmark,
};

const catIcon = {
  Emergency: ShieldAlert,
  Legal: Scale,
  Cyber: Shield,
  "Mental Health": Heart,
  Child: Baby,
};

const catColor = {
  Emergency: "bg-rose-100 text-rose-700",
  Legal: "bg-indigo-100 text-indigo-700",
  Cyber: "bg-slate-100 text-slate-700",
  "Mental Health": "bg-emerald-100 text-emerald-700",
  Child: "bg-purple-100 text-purple-700",
};

export default function WomenSafety() {
  return (
    <>
      <PageHeader
        eyebrow="WOMEN'S SAFETY"
        title="Know the helplines, know your rights"
        description="An educational hub with government helplines, complaint portals, safety apps and legal rights every woman in India should know. All numbers and portals are official."
      />

      {/* Emergency Callout */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-4 mb-10">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card gradient-border rounded-3xl p-6 sm:p-7 grid md:grid-cols-4 gap-4"
        >
          <div className="md:col-span-2">
            <div className="text-xs font-bold text-rose-600 uppercase tracking-wider">In danger right now?</div>
            <h2 className="mt-1 text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Call <a href="tel:112" className="brand-gradient-text">112</a> immediately
            </h2>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              India's single emergency helpline for police, ambulance and fire. Works by voice call, SMS or by triple-pressing the power button on most smartphones.
            </p>
          </div>
          <EmergencyPill number="112" label="Police / Fire / Ambulance" href="tel:112" />
          <EmergencyPill number="1091" label="Women Helpline" href="tel:1091" />
        </motion.div>
      </section>

      {/* Helplines */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-12">
        <SectionTitle eyebrow="OFFICIAL HELPLINES" title="24×7 support numbers" />
        <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {helplines.map((h, i) => {
            const Icon = catIcon[h.category];
            return (
              <motion.article
                key={h.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ delay: i * 0.03 }}
                className="glass-card glass-hover rounded-3xl p-5"
              >
                <div className="flex items-start justify-between">
                  <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center", catColor[h.category])}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold border bg-white/70 text-slate-700 border-white/80">
                    {h.hours}
                  </span>
                </div>
                <h3 className="mt-3 text-lg font-bold text-slate-900 leading-snug">{h.name}</h3>
                <a href={`tel:${h.number.replace(/[^\d]/g, "")}`} className="mt-1 flex items-center gap-1.5 text-2xl font-extrabold brand-gradient-text">
                  <Phone className="w-5 h-5 text-indigo-600" /> {h.number}
                </a>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed line-clamp-3">{h.description}</p>
                {h.url && (
                  <a
                    href={h.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-indigo-700 hover:text-indigo-900"
                  >
                    Learn more <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </motion.article>
            );
          })}
        </div>
      </section>

      {/* Portals */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-12">
        <SectionTitle eyebrow="COMPLAINT PORTALS & CENTRES" title="Where to file, ask & seek help" />
        <div className="mt-6 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {womenPortals.map((p, i) => {
            const Icon = iconMap[p.icon] || Shield;
            return (
              <motion.article
                key={p.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ delay: i * 0.03 }}
                className="glass-card glass-hover gradient-border rounded-3xl p-5 flex flex-col"
              >
                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner", p.color)}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="mt-3 text-lg font-bold text-slate-900 leading-snug">{p.name}</h3>
                <p className="mt-1 text-sm text-slate-600 leading-relaxed line-clamp-3">{p.purpose}</p>
                <ul className="mt-3 space-y-1.5 text-xs text-slate-700">
                  {p.services.map((s) => (
                    <li key={s} className="flex items-start gap-1.5">
                      <span className="mt-1 w-1 h-1 rounded-full bg-indigo-500 flex-none" /> {s}
                    </li>
                  ))}
                </ul>
                <a
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center justify-center gap-1.5 h-10 rounded-xl brand-gradient text-white font-semibold text-xs shadow-md hover:-translate-y-0.5 transition"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> Visit Official Portal
                </a>
              </motion.article>
            );
          })}
        </div>
      </section>

      {/* Rights */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-12">
        <SectionTitle eyebrow="LEGAL RIGHTS" title="Key laws that protect women in India" />
        <div className="mt-6 grid md:grid-cols-2 gap-5">
          {rights.map((r, i) => (
            <motion.article
              key={r.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ delay: i * 0.03 }}
              className="glass-card rounded-3xl p-5"
            >
              <div className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-bold text-slate-900">{r.title}</h3>
              </div>
              <div className="text-xs text-indigo-700 font-semibold mt-1">{r.law}</div>
              <p className="mt-3 text-sm text-slate-600 leading-relaxed">{r.description}</p>
            </motion.article>
          ))}
        </div>
      </section>

      {/* Apps */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16">
        <SectionTitle eyebrow="SAFETY APPS" title="Install these on your phone" />
        <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {safetyApps.map((a, i) => (
            <motion.a
              key={a.name}
              href={a.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ delay: i * 0.03 }}
              className="glass-card glass-hover rounded-3xl p-5 flex items-start gap-3"
            >
              <div className="w-11 h-11 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
                <Smartphone className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-bold text-slate-900">{a.name}</div>
                <div className="text-[11px] text-indigo-700 font-semibold">{a.os}</div>
                <div className="text-xs text-slate-600 mt-1 line-clamp-2">{a.short}</div>
              </div>
              <ExternalLink className="w-4 h-4 text-slate-400 mt-1" />
            </motion.a>
          ))}
        </div>
      </section>
    </>
  );
}

function EmergencyPill({
  number,
  label,
  href
}) {
  return (
    <a
      href={href}
      className="glass rounded-2xl p-4 flex flex-col justify-center hover:bg-white/80 transition"
    >
      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{label}</div>
      <div className="mt-1 flex items-center gap-2 text-3xl font-extrabold text-slate-900">
        <Phone className="w-6 h-6 text-rose-500" /> {number}
      </div>
    </a>
  );
}

function SectionTitle({
  eyebrow,
  title
}) {
  return (
    <div>
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass text-[10px] font-bold uppercase tracking-wider text-indigo-700">
        {eyebrow}
      </div>
      <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">{title}</h2>
    </div>
  );
}
