import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { Loader2 } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ErrorBoundary from "@/components/features/ErrorBoundary";

// Route-level code splitting: each page is its own chunk, fetched on demand.
const Landing = lazy(() => import("@/pages/Landing"));
const Schemes = lazy(() => import("@/pages/Schemes"));
const Scholarships = lazy(() => import("@/pages/Scholarships"));
const Documents = lazy(() => import("@/pages/Documents"));
const DocumentGuide = lazy(() => import("@/pages/DocumentGuide"));
const WomenSafety = lazy(() => import("@/pages/WomenSafety"));
const NotFound = lazy(() => import("@/pages/NotFound"));

function RouteFallback() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
    </div>
  );
}

export default function App() {
  return (
    <div className="min-h-screen text-slate-900 flex flex-col">
      <Navbar />
      <main className="flex-1">
        <ErrorBoundary>
          <Suspense fallback={<RouteFallback />}>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/documents" element={<Documents />} />
              <Route path="/documents/:slug" element={<DocumentGuide />} />
              <Route path="/schemes" element={<Schemes />} />
              <Route path="/scholarships" element={<Scholarships />} />
              <Route path="/women-safety" element={<WomenSafety />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </main>
      <Footer />
    </div>
  );
}
