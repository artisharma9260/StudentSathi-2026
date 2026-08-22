import { Link } from "react-router-dom";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <section className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-7xl font-extrabold brand-gradient-text">404</div>
        <h1 className="mt-4 text-2xl font-bold text-slate-900">This page seems to have graduated.</h1>
        <p className="mt-2 text-slate-600">The page you're looking for doesn't exist or has been moved.</p>
        <Link to="/" className="mt-6 inline-flex items-center gap-2 px-5 py-3 rounded-full brand-gradient text-white font-semibold">
          <Home className="w-4 h-4" /> Back to Home
        </Link>
      </div>
    </section>
  );
}
