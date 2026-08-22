import { motion } from "framer-motion";
import { Star } from "lucide-react";

const items = [
  {
    name: "Priya Sharma",
    role: "BSc Nursing · Rajasthan",
    quote: "Sathi's AI matched me with 3 scholarships I never knew existed. Got ₹40,000 for my second year!",
    img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop",
  },
  {
    name: "Rahul Verma",
    role: "BTech CSE · Bihar",
    quote: "The document assistant walked me through my PAN + income certificate in one afternoon. Life saver.",
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
  },
  {
    name: "Aisha Khan",
    role: "12th commerce · UP",
    quote: "Voice assistant in Hindi is a blessing for my mom. She now checks my progress herself.",
    img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-block px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-semibold mb-3">
            STORIES
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">Students, empowered</h2>
          <p className="mt-3 text-slate-600">Real experiences from students across India.</p>
        </div>

        <div className="mt-12 grid md:grid-cols-3 gap-5">
          {items.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="rounded-2xl bg-white border border-slate-100 p-6 soft-shadow hover:-translate-y-1 transition"
            >
              <div className="flex text-orange-500 mb-3">
                {Array.from({ length: 5 }).map((_, k) => (
                  <Star key={k} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-slate-700 leading-relaxed">"{t.quote}"</p>
              <div className="mt-5 flex items-center gap-3">
                <img src={t.img} alt={t.name} className="w-11 h-11 rounded-full object-cover" />
                <div>
                  <div className="font-semibold text-slate-900 text-sm">{t.name}</div>
                  <div className="text-xs text-slate-500">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
