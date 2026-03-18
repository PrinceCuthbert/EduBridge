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

// ── Storage migration ─────────────────────────────────────────
// Bumping this version clears stale mock data from any visitor's
// browser on their next load. Only runs in production.
// DEV keeps its seed data untouched.
const STORAGE_VERSION = "v2";
const VERSION_KEY = "edubridge_storage_version";

// Mock data keys that should be empty in production.
// Users key is intentionally excluded — demo accounts must survive.
const MOCK_ONLY_KEYS = [
  "edubridge_visa_requests",
  "edubridge_applications",
  "edubridge_programs",
];

// This to clean the browser of any mock data that might conflict with the current version of the app. And for any user or device.
function purgeStaleMockData() {
  if (import.meta.env.DEV) return; // never touch dev storage
  if (localStorage.getItem(VERSION_KEY) === STORAGE_VERSION) return; // already migrated
  MOCK_ONLY_KEYS.forEach((key) => localStorage.removeItem(key));
  localStorage.setItem(VERSION_KEY, STORAGE_VERSION);
}

// Run once — before React renders anything.
purgeStaleMockData();

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
