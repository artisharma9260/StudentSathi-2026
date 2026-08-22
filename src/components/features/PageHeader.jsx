import { motion } from "framer-motion";

export default function PageHeader({
  eyebrow,
  title,
  description,
  children
}) {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute -top-24 -right-16 w-96 h-96 rounded-full bg-purple-300/30 blur-3xl" />
      <div className="absolute -bottom-16 -left-16 w-96 h-96 rounded-full bg-indigo-300/30 blur-3xl" />
      <div className="absolute top-1/2 left-1/3 w-72 h-72 rounded-full bg-emerald-200/30 blur-3xl" />
      <div className="absolute inset-0 pattern-dots opacity-50" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-14 pb-14">
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          {eyebrow && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass text-xs font-bold text-indigo-700 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {eyebrow}
            </div>
          )}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 max-w-3xl tracking-tight">
            {title}
          </h1>
          {description && (
            <p className="mt-4 text-slate-600 max-w-2xl text-base sm:text-lg leading-relaxed">{description}</p>
          )}
          {children && <div className="mt-6">{children}</div>}
        </motion.div>
      </div>
    </section>
  );
}
