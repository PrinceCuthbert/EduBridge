import React, { useEffect, Suspense, lazy } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { Toaster } from "sonner";
import "aos/dist/aos.css";
import AOS from "aos";

import LoadingSpinner from "./components/LoadingSpinner";
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
          position="top-center" // Standard modern placement, but you can keep top-center
          expand={true} // Stacks them beautifully when multiple fire
          richColors // Magically adds the perfect colored icons for success/error/warning
          toastOptions={{
            style: { zIndex: 9999 },
            classNames: {
              // ── Base toast shell (Clean white, subtle border, nice shadow) ──
              toast:
                "group flex gap-3 items-start w-full bg-white border border-slate-200 rounded-xl shadow-lg p-4 font-sans",

              // ── Typography ──
              title: "text-sm font-semibold text-slate-900",
              description: "text-sm text-slate-500 mt-1",

              // ── Interactive Buttons ──
              actionButton:
                "bg-slate-900 text-white font-medium px-3 py-1.5 rounded-md text-xs transition-colors hover:bg-slate-800",
              cancelButton:
                "bg-slate-100 text-slate-700 font-medium px-3 py-1.5 rounded-md text-xs transition-colors hover:bg-slate-200",
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
