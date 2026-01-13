import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Global Components
import Header from "./components/Header";
import Footer from "./pages/footer/footer.jsx";

// Page Sections (Home)
import Hero from "./pages/home/Hero";
import WhyChoose from "./pages/home/WhyChoose";
import AcademicServices from "./pages/home/AcademicServices";
import CoursesPreview from "./pages/home/CoursesPreview";
import MembershipPlans from "./pages/home/MembershipPlans";
import Testimonials from "./pages/home/Testimonials";
import CallToAction from "./pages/home/CallToAction";

// Pages
import ContactPage from "./pages/contact/contactPage.jsx";
import MembershipPage from "./pages/membership/MembershipPage.jsx";
import AboutUsPage from "./pages/aboutUs/AboutUsPage.jsx";
import CoursesPage from "./pages/coursesPage/coursesPage.jsx";
import ResourcesPage from "./pages/resources/resourcesPage.jsx";
import FacultiesDetails from "./pages/resources/faculties/FacultiesDetails.jsx";
import UniversitiesTab from "./pages/resources/UniversitiesTab.jsx";

// Global Styles
import "./index.css";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">
        <Header />
        <main>
          <Routes>
            <Route
              path="/"
              element={
                <div className="flex flex-col">
                  <Hero />
                  <WhyChoose />
                  <AcademicServices />
                  <CoursesPreview />
                  <MembershipPlans />
                  <Testimonials />
                  <CallToAction />
                </div>
              }
            />
            <Route path="/contactPage" element={<ContactPage />} />
            <Route path="/membershipPage" element={<MembershipPage />} />
            <Route path="/AboutUsPage" element={<AboutUsPage />} />
            <Route path="/coursesPage" element={<CoursesPage />} />
            <Route path="/resourcesPage" element={<ResourcesPage />} />
            <Route path="/resources/:universityName/faculties" element={<FacultiesDetails />} />
            <Route path="/UniversitiesTab" element={<UniversitiesTab />} />
            <Route path="/resources/universities" element={<UniversitiesTab />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
