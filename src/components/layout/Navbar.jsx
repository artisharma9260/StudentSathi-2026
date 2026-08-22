import { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X, GraduationCap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/documents", label: "Documents" },
  { to: "/schemes", label: "Schemes" },
  { to: "/scholarships", label: "Scholarships" },
  { to: "/women-safety", label: "Women Safety" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full transition-all duration-300",
        scrolled
          ? "glass-nav shadow-[0_8px_30px_-12px_rgba(99,102,241,0.25)]"
          : "bg-white/40 backdrop-blur-md"
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative">
              <div className="w-9 h-9 rounded-xl brand-gradient flex items-center justify-center text-white shadow-md group-hover:scale-105 transition">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full ring-2 ring-white" />
            </div>
            <div className="leading-tight">
              <div className="font-bold text-slate-900 text-lg">StudentSathi</div>
              <div className="text-[10px] uppercase tracking-wider text-indigo-600 font-semibold">Guidance · Not Application</div>
            </div>
          </Link>

          <nav className="hidden xl:flex items-center gap-0.5">
            {navLinks.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === "/"}
                className={({ isActive }) =>
                  cn(
                    "relative px-3 py-2 rounded-full text-sm font-medium transition",
                    isActive
                      ? "text-indigo-700"
                      : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <span className="relative z-10">{l.label}</span>
                    {isActive && (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute inset-0 rounded-full bg-white/80 border border-indigo-100 shadow-sm"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <button
            onClick={() => setOpen((o) => !o)}
            className="xl:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg hover:bg-white/70"
            aria-label="Toggle menu"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="xl:hidden border-t border-white/60 glass-nav"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  end={l.to === "/"}
                  className={({ isActive }) =>
                    cn(
                      "block px-3 py-2.5 rounded-xl text-sm font-medium",
                      isActive ? "bg-white/80 text-indigo-700 border border-indigo-100" : "text-slate-700 hover:bg-white/70"
                    )
                  }
                >
                  {l.label}
                </NavLink>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
