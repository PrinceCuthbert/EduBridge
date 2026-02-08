import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate, Outlet } from 'react-router-dom';
import { Toaster } from 'sonner';
import 'aos/dist/aos.css';
import AOS from 'aos';

// Components
import Header from './components/Header';
import Footer from './pages/footer/footer'; 
import WhatsAppButton from './components/WhatsAppButton';
import LoadingSpinner from './components/LoadingSpinner';

// Lazy Load Pages for Performance
// Lazy Load Pages for Performance
const LandingPage = lazy(() => import('./pages/home/LandingPage'));

// Legacy Pages
const AboutUsPage = lazy(() => import('./pages/aboutUs/AboutUsPage'));
const ContactPage = lazy(() => import('./pages/contact/contactPage'));
const Signin = lazy(() => import('./pages/auth/SignInPage'));
const Signup = lazy(() => import('./pages/auth/SignUpPage'));

// New Pages
const BlogDetailsPage = lazy(() => import('./pages/blog/BlogDetailsPage'));

// New Pages
const DigitalLibraryPage = lazy(() => import('./pages/library/DigitalLibraryPage'));
const BranchesPage = lazy(() => import('./pages/branches/BranchesPage'));
const StudyAbroadPage = lazy(() => import('./pages/study-abroad/StudyAbroadPage'));
const ProgramDetail = lazy(() => import('./pages/study-abroad/ProgramDetail'));
const AdminProgramDetail = lazy(() => import('./pages/admin/AdminProgramDetail'));
const VisaConsultationPage = lazy(() => import('./pages/visa/VisaConsultationPage'));
const ScholarshipsPage = lazy(() => import('./pages/scholarships/ScholarshipsPage'));
const GalleryPage = lazy(() => import('./pages/gallery/GalleryPage'));
const PartnersPage = lazy(() => import('./pages/partners/PartnersPage'));
const BlogPage = lazy(() => import('./pages/blog/BlogPage'));

// Placeholder Pages
const CoursesPage = lazy(() => import('./pages/coursesPage/coursesPage'));
const MembershipPage = lazy(() => import('./pages/membership/MembershipPage'));
const Dashboard = lazy(() => import('./pages/dashboard/Dashboard'));
const ComingSoonPage = lazy(() => import('./pages/ComingSoonPage'));

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

import usePageLanguage from './hooks/usePageLanguage';

import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';

// Admin Pages - Lazy Loaded
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'));
const AdminOverview = lazy(() => import('./pages/admin/AdminOverview'));
const ScholarshipManager = lazy(() => import('./pages/admin/ScholarshipManager'));
const ApplicationReview = lazy(() => import('./pages/admin/ApplicationReview'));
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'));
import ContentManagement from './pages/admin/ContentManagement';
import CMSScholarships from './pages/admin/cms/CMSScholarships';
import CMSLibrary from './pages/admin/cms/CMSLibrary';
import CMSPosts from './pages/admin/cms/CMSPosts';
import CMSMedia from './pages/admin/cms/CMSMedia';
const BranchManagement = lazy(() => import('./pages/admin/BranchManagement'));
const UserManagement = lazy(() => import('./pages/admin/UserManagement'));
const FinancialReports = lazy(() => import('./pages/admin/FinancialReports'));
const Analytics = lazy(() => import('./pages/admin/Analytics'));
const VisaCases = lazy(() => import('./pages/admin/VisaCases'));


// Dashboard Layout - Lazy Loaded
const StudentDashboardLayout = lazy(() => import('./pages/dashboard/StudentDashboardLayout'));

const PublicLayout = () => (
  <>
    <Suspense fallback={<div className="h-16 bg-white shadow-sm" />}>
      <Header />
    </Suspense>
    <main className="flex-grow">
      <Outlet />
    </main>
    <Footer />
    <WhatsAppButton />
  </>
);

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
        <Toaster position="top-center" richColors toastOptions={{ style: { zIndex: 9999 } }} />
        <div className="flex flex-col min-h-screen">
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              {/* Public Routes - Wrapped in PublicLayout */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={
                  <PublicRoute>
                    <LandingPage />
                  </PublicRoute>
                } />
                <Route path="/aboutUsPage" element={<AboutUsPage />} />
                <Route path="/contactPage" element={<ContactPage />} />
                
                {/* New Routes */}
                <Route path="/library" element={<DigitalLibraryPage />} />
                <Route path="/branches" element={<BranchesPage />} />
                <Route path="/study-abroad" element={<StudyAbroadPage />} />
                <Route path="/study-abroad/:id" element={<ProgramDetail />} />
                <Route path="/visa-consultation" element={<VisaConsultationPage />} />
                <Route path="/scholarships" element={<ScholarshipsPage />} />
                <Route path="/gallery" element={<GalleryPage />} />
                <Route path="/partners" element={<PartnersPage />} />
                <Route path="/blogs" element={<BlogPage />} />
                <Route path="/blogs/:id" element={<BlogDetailsPage />} />
                
                {/* Existing/Placeholder Routes */}
                <Route path="/coursesPage" element={<CoursesPage />} />
                <Route path="/membershipPage" element={<MembershipPage />} />
                <Route path="/coming-soon" element={<ComingSoonPage />} />

                {/* Auth Routes */}
                <Route path="/signin" element={
                  <PublicRoute>
                    <Signin />
                  </PublicRoute>
                } />
                <Route path="/signup" element={
                  <PublicRoute>
                    <Signup />
                  </PublicRoute>
                } />
              </Route>
              
              {/* Protected Student Dashboard */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <StudentDashboardLayout />
                  </ProtectedRoute>
                } 
              >
                  <Route index element={<Dashboard />} />
                  <Route path="profile" element={<div className="p-8">My Profile (Coming Soon)</div>} />
              </Route>

              {/* Admin Routes */}
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="dashboard" element={<AdminOverview />} />
                <Route path="users" element={<UserManagement />} />
                <Route path="applications" element={<ApplicationReview />} />
                <Route path="visa" element={<VisaCases />} />
                <Route path="programs" element={<ScholarshipManager />} />
                <Route path="programs/:id" element={<AdminProgramDetail />} />
                <Route path="cms" element={<ContentManagement />}>
                  <Route index element={<Navigate to="scholarships" replace />} />
                  <Route path="scholarships" element={<CMSScholarships />} />
                  <Route path="library" element={<CMSLibrary />} />
                  <Route path="posts" element={<CMSPosts />} />
                  <Route path="media" element={<CMSMedia />} />
                </Route>
                <Route path="branches" element={<BranchManagement />} />
                <Route path="finance" element={<FinancialReports />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="settings" element={<AdminSettings />} />
              </Route>
              
            </Routes>
          </Suspense>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
