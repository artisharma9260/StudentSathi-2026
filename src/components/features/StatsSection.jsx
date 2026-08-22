import { motion } from "framer-motion";
import { Users, Award, FileText, Sparkles } from "lucide-react";

const stats = [
  { icon: Award, label: "Schemes indexed", value: "1,240+", color: "text-blue-600 bg-blue-50" },
  { icon: FileText, label: "Docs simplified", value: "35+", color: "text-orange-600 bg-orange-50" },
  { icon: Users, label: "Students helped", value: "5.2L+", color: "text-green-600 bg-green-50" },
  { icon: Sparkles, label: "AI matches/day", value: "12k+", color: "text-purple-600 bg-purple-50" },
];

export default function StatsSection() {
  return (
    <section className="py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-white border border-slate-100 soft-shadow p-6 sm:p-8 grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="flex items-center gap-4"
            >
              <div className={`w-12 h-12 rounded-2xl ${s.color} flex items-center justify-center`}>
                <s.icon className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900">{s.value}</div>
                <div className="text-xs text-slate-500 font-medium">{s.label}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
