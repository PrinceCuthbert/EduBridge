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
          richColors
          toastOptions={{ style: { zIndex: 9999 } }}
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
