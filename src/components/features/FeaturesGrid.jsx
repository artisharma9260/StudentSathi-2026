import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Award, IdCard, GraduationCap, ShieldAlert } from "lucide-react";

const features = [
  {
    to: "/documents",
    title: "Documents & ID Help",
    desc: "Aadhaar, PAN, Passport, Voter ID and more — step-by-step application timelines.",
    icon: IdCard,
    color: "from-blue-400 to-blue-600",
    bg: "bg-blue-50",
    fg: "text-blue-600",
  },
  {
    to: "/schemes",
    title: "Government Schemes",
    desc: "Central & state schemes with filters, eligibility and official apply links.",
    icon: Award,
    color: "from-green-400 to-emerald-500",
    bg: "bg-green-50",
    fg: "text-green-600",
  },
  {
    to: "/scholarships",
    title: "Scholarships",
    desc: "Government, private and international scholarships — eligibility, amounts and deadlines.",
    icon: GraduationCap,
    color: "from-indigo-400 to-indigo-600",
    bg: "bg-indigo-50",
    fg: "text-indigo-600",
  },
  {
    to: "/women-safety",
    title: "Women Safety",
    desc: "Helplines, complaint portals, safety apps and key rights — all in one place.",
    icon: ShieldAlert,
    color: "from-red-400 to-red-600",
    bg: "bg-red-50",
    fg: "text-red-600",
  },
];

export default function FeaturesGrid() {
  return (
    <section className="py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-3">
            EXPLORE
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
            One platform for every student need
          </h2>
          <p className="mt-3 text-slate-600">
            Government documents, schemes, scholarships and women's safety — simplified in plain language.
          </p>
        </div>

        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: i * 0.04 }}
            >
              <Link
                to={f.to}
                className="group block h-full rounded-2xl p-6 bg-white border border-slate-100 hover:border-blue-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/10 transition-all"
              >
                <div className={`w-12 h-12 rounded-xl ${f.bg} ${f.fg} flex items-center justify-center mb-4 group-hover:scale-110 transition`}>
                  <f.icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-slate-900 text-lg">{f.title}</h3>
                <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">{f.desc}</p>
                <div className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-blue-600">
                  Explore <span className="group-hover:translate-x-1 transition">→</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
