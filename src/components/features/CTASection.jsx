import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function CTASection() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl brand-gradient p-10 sm:p-14 text-white shadow-2xl shadow-blue-500/25"
        >
          <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-purple-400/20 blur-3xl" />
          <div className="relative flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" /> Get started free
              </div>
              <h2 className="mt-4 text-3xl sm:text-4xl font-bold leading-tight">
                Find the right scheme or scholarship in minutes.
              </h2>
              <p className="mt-3 text-white/90">
                Browse eligibility, benefits and official apply links for schemes and scholarships — no jargon, no confusion.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/schemes"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-white text-blue-700 font-semibold shadow-lg hover:-translate-y-0.5 transition"
              >
                Browse Schemes <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/scholarships"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-white/15 backdrop-blur border border-white/30 text-white font-semibold hover:bg-white/25 transition"
              >
                Explore Scholarships
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
