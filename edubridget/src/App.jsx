import React, { useEffect, Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "sonner";
import "aos/dist/aos.css";
import AOS from "aos";

import LoadingSpinner from "./components/LoadingSpinner";
import WhatsAppButton from "./components/WhatsAppButton"; // Wait, WhatsAppButton is in PublicLayout?
// WhatsAppButton was in PublicLayout in my new code. So I can remove it from here?
// But it was also in App.jsx line 128 (PublicLayout definition).
// So if PublicRoutes uses PublicLayout, WhatsAppButton is there.
// Does Admin need WhatsAppButton? Probably not.
// Does Student need it? Probably not.
// So removing from App.jsx is correct.

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
      duration: 1000,
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
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
