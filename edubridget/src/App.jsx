import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import 'aos/dist/aos.css';
import AOS from 'aos';

// Components
import Header from './components/Header';
import Footer from './pages/footer/footer'; 
import WhatsAppButton from './components/WhatsAppButton';
import LoadingSpinner from './components/LoadingSpinner';

// Lazy Load Pages for Performance
const Hero = lazy(() => import('./pages/home/Hero'));
const WhyChoose = lazy(() => import('./pages/home/pages/WhyChoose'));
const AcademicServices = lazy(() => import('./pages/home/pages/AcademicServices'));
const CallToAction = lazy(() => import('./pages/home/pages/CallToAction'));

// Legacy Pages
const AboutUsPage = lazy(() => import('./pages/aboutUs/AboutUsPage'));
const ContactPage = lazy(() => import('./pages/contact/contactPage'));
const Signin = lazy(() => import('./pages/auth/SignInPage'));
const Signup = lazy(() => import('./pages/auth/SignUpPage'));

// New Pages
const DigitalLibraryPage = lazy(() => import('./pages/library/DigitalLibraryPage'));
const BranchesPage = lazy(() => import('./pages/branches/BranchesPage'));
const StudyAbroadPage = lazy(() => import('./pages/study-abroad/StudyAbroadPage'));
const VisaConsultationPage = lazy(() => import('./pages/visa/VisaConsultationPage'));
const ScholarshipsPage = lazy(() => import('./pages/scholarships/ScholarshipsPage'));
const GalleryPage = lazy(() => import('./pages/gallery/GalleryPage'));
const PartnersPage = lazy(() => import('./pages/partners/PartnersPage'));
const BlogPage = lazy(() => import('./pages/blog/BlogPage'));

// Placeholder Pages
const CoursesPage = lazy(() => import('./pages/coursesPage/coursesPage'));
const MembershipPage = lazy(() => import('./pages/membership/MembershipPage'));
const Dashboard = lazy(() => import('./pages/dashboard/Dashboard'));

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

function App() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={
                <>
                  <Hero />
                  <WhyChoose />
                  <AcademicServices />
                  <CallToAction />
                </>
              } />
              <Route path="/aboutUsPage" element={<AboutUsPage />} />
              <Route path="/contactPage" element={<ContactPage />} />
              
              {/* New Routes */}
              <Route path="/library" element={<DigitalLibraryPage />} />
              <Route path="/branches" element={<BranchesPage />} />
              <Route path="/study-abroad" element={<StudyAbroadPage />} />
              <Route path="/visa-consultation" element={<VisaConsultationPage />} />
              <Route path="/scholarships" element={<ScholarshipsPage />} />
              <Route path="/gallery" element={<GalleryPage />} />
              <Route path="/partners" element={<PartnersPage />} />
              <Route path="/blogs" element={<BlogPage />} />
              
              {/* Existing/Placeholder Routes */}
              <Route path="/coursesPage" element={<CoursesPage />} />
              <Route path="/membershipPage" element={<MembershipPage />} />
              <Route path="/dashboard" element={<Dashboard />} />
              
              {/* Auth Routes */}
              <Route path="/signin" element={<Signin />} />
              <Route path="/signup" element={<Signup />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
        <WhatsAppButton />
      </div>
    </Router>
  );
}

export default App;
