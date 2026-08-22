import { motion } from "framer-motion";
import { UserPlus, Search, Sparkles, Rocket } from "lucide-react";

const steps = [
  { icon: UserPlus, title: "Create your Passport", desc: "Add your basics — course, state, income, category. Verified once, used everywhere." },
  { icon: Sparkles, title: "AI matches you", desc: "Sathi AI scans 1200+ opportunities and ranks them by eligibility match." },
  { icon: Search, title: "Explore & save", desc: "Read simplified guides, save resources, get a personal checklist." },
  { icon: Rocket, title: "Apply confidently", desc: "Follow step-by-step timelines with documents and deadlines." },
];

export default function HowItWorks() {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-blue-50/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-block px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-semibold mb-3">
            HOW IT WORKS
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">From confusion to clarity in 4 steps</h2>
          <p className="mt-3 text-slate-600">Designed for every Indian student — first-timers, first-gen learners and beyond.</p>
        </div>

        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {steps.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="relative rounded-2xl bg-white border border-slate-100 p-6 soft-shadow"
            >
              <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full brand-gradient text-white font-bold text-sm flex items-center justify-center shadow-lg">
                {i + 1}
              </div>
              <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <s.icon className="w-5 h-5" />
              </div>
              <h3 className="mt-4 font-semibold text-slate-900">{s.title}</h3>
              <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
