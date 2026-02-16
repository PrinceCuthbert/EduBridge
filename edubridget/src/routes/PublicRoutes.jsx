import React, { lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import PublicLayout from '../components/PublicLayout';
import PublicRoute from '../components/PublicRoute';

// Lazy Load Pages
const LandingPage = lazy(() => import("../pages/home/LandingPage"));
const AboutUsPage = lazy(() => import("../pages/aboutUs/AboutUsPage"));
const ContactPage = lazy(() => import("../pages/contact/contactPage"));
const Signin = lazy(() => import("../pages/auth/SignInPage"));
const Signup = lazy(() => import("../pages/auth/SignUpPage"));
const BlogDetailsPage = lazy(() => import("../pages/blog/BlogDetailsPage"));
const NotFound = lazy(() => import("../pages/NotFound"));
const DigitalLibraryPage = lazy(() => import("../pages/library/DigitalLibraryPage"));
const BranchesPage = lazy(() => import("../pages/branches/BranchesPage"));
const StudyAbroadPage = lazy(() => import("../pages/study-abroad/StudyAbroadPage"));
const ProgramDetail = lazy(() => import("../pages/study-abroad/ProgramDetail"));
const VisaConsultationPage = lazy(() => import("../pages/visa/VisaConsultationPage"));
const ScholarshipsPage = lazy(() => import("../pages/scholarships/ScholarshipsPage"));
const GalleryPage = lazy(() => import("../pages/gallery/GalleryPage"));
const PartnersPage = lazy(() => import("../pages/partners/PartnersPage"));
const BlogPage = lazy(() => import("../pages/blog/BlogPage"));
const CoursesPage = lazy(() => import("../pages/coursesPage/coursesPage"));
const MembershipPage = lazy(() => import("../pages/membership/MembershipPage"));
const ComingSoonPage = lazy(() => import("../pages/ComingSoonPage"));

export default function PublicRoutes() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={
           <PublicRoute>
             <LandingPage />
           </PublicRoute>
        } />
        
        <Route path="aboutuspage" element={<AboutUsPage />} />
        <Route path="contactPage" element={<ContactPage />} />
        
        {/* New Routes */}
        <Route path="library" element={<DigitalLibraryPage />} />
        <Route path="branches" element={<BranchesPage />} />
        <Route path="study-abroad" element={<StudyAbroadPage />} />
        <Route path="study-abroad/:id" element={<ProgramDetail />} />
        <Route path="visa-consultation" element={<VisaConsultationPage />} />
        <Route path="scholarships" element={<ScholarshipsPage />} />
        <Route path="gallery" element={<GalleryPage />} />
        <Route path="partners" element={<PartnersPage />} />
        <Route path="blogs" element={<BlogPage />} />
        <Route path="blogs/:id" element={<BlogDetailsPage />} />
        
        {/* Placeholders */}
        <Route path="coursesPage" element={<CoursesPage />} />
        <Route path="membershipPage" element={<MembershipPage />} />
        <Route path="coming-soon" element={<ComingSoonPage />} />
        
        {/* Auth */}
        <Route path="signin" element={<PublicRoute><Signin /></PublicRoute>} />
        <Route path="signup" element={<PublicRoute><Signup /></PublicRoute>} />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
