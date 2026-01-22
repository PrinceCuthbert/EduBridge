import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import 'aos/dist/aos.css';
import AOS from 'aos';

// Components
import Header from './components/Header';
import Footer from './pages/footer/footer'; // Corrected path
import WhatsAppButton from './components/WhatsAppButton';
import LoadingSpinner from './components/LoadingSpinner';

// Pages
import Hero from './pages/home/Hero';
import WhyChoose from './pages/home/WhyChoose';
import AcademicServices from './pages/home/AcademicServices';
import CallToAction from './pages/home/CallToAction';

// Legacy Pages (Maintained)
import AboutUsPage from './pages/aboutUs/AboutUsPage'; // Corrected path
import ContactPage from './pages/contact/contactPage'; // Corrected path
import Signin from './pages/auth/SignInPage'; // Corrected path
import Signup from './pages/auth/SignUpPage'; // Corrected path

// New Pages
import DigitalLibraryPage from './pages/library/DigitalLibraryPage';
import BranchesPage from './pages/branches/BranchesPage';
import StudyAbroadPage from './pages/study-abroad/StudyAbroadPage';
import VisaConsultationPage from './pages/visa/VisaConsultationPage';
import ScholarshipsPage from './pages/scholarships/ScholarshipsPage';
import GalleryPage from './pages/gallery/GalleryPage';
import PartnersPage from './pages/partners/PartnersPage';
import BlogPage from './pages/blog/BlogPage';

// Placeholder Pages (To be implemented or reused if existing)
import CoursesPage from './pages/coursesPage/coursesPage'; // Corrected path
import MembershipPage from './pages/membership/MembershipPage'; // Corrected path
import Dashboard from './pages/dashboard/Dashboard'; // Created path

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
    // Simulate loading time
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Router>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
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
        </main>
        <Footer />
        <WhatsAppButton />
      </div>
    </Router>
  );
}

export default App;
