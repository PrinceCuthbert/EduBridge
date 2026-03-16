import React, { useEffect, Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "sonner";
import "aos/dist/aos.css";
import AOS from "aos";

import LoadingSpinner from "./components/LoadingSpinner";
import WhatsAppButton from "./components/WhatsAppButton";
import ErrorBoundary from "./components/ErrorBoundary";
import usePageLanguage from "./hooks/usePageLanguage";
import { AuthProvider } from "./context/AuthContext";

// Lazy Load Route Handlers
const PublicRoutes = lazy(() => import("./routes/PublicRoutes"));
const StudentRoutes = lazy(() => import("./routes/StudentRoutes"));
const AdminRoutes = lazy(() => import("./routes/AdminRoutes"));

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

function App() {
  usePageLanguage();

  useEffect(() => {
    AOS.init({
      duration: 600,
      once: true,
    });
  }, []);

  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <Toaster
          position="top-center"
          toastOptions={{
            style: { zIndex: 9999 },
            classNames: {
              // ── Base toast shell ──────────────────────────────
              toast:
                "rounded-xl border shadow-lg px-5 py-4 font-sans flex gap-3 items-start",
              // ── Typography ────────────────────────────────────
              title: "text-base font-semibold leading-snug",
              description: "text-sm mt-0.5 leading-relaxed opacity-90",
              // ── Per-type colors (system palette) ─────────────
              success:
                "bg-emerald-50 border-emerald-200 text-emerald-900",
              error:
                "bg-red-50 border-red-200 text-red-900",
              warning:
                "bg-red-50 border-red-200 text-red-900",
              info:
                "bg-blue-50 border-blue-200 text-blue-900",
              // ── Action / cancel buttons ───────────────────────
              actionButton:
                "bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-3.5 py-1.5 rounded-lg transition-colors",
              cancelButton:
                "bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium px-3.5 py-1.5 rounded-lg transition-colors",
            },
          }}
        />
        <div className="flex flex-col min-h-screen">
          {/* ErrorBoundary catches chunk load failures from lazy routes */}
          <ErrorBoundary>
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                {/* Admin Section */}
                <Route path="/admin/*" element={<AdminRoutes />} />

                {/* Student Dashboard Section */}
                <Route path="/dashboard/*" element={<StudentRoutes />} />

                {/* Public Section (Catch-all) */}
                <Route path="/*" element={<PublicRoutes />} />
              </Routes>
            </Suspense>
          </ErrorBoundary>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
