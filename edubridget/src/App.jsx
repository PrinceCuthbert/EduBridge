import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Global Components
import Header from "./components/Header";
import Footer from "./pages/footer/footer.jsx";
import LandingPage from "./pages/home/LandingPage.jsx";

// Pages
import ContactPage from "./pages/contact/contactPage.jsx";
import MembershipPage from "./pages/membership/MembershipPage.jsx";
import AboutUsPage from "./pages/aboutUs/AboutUsPage.jsx";
import CoursesPage from "./pages/coursesPage/coursesPage.jsx";
import ResourcesPage from "./pages/resources/resourcesPage.jsx";
import FacultiesDetails from "./pages/resources/faculties/FacultiesDetails.jsx";
import UniversitiesTab from "./pages/resources/UniversitiesTab.jsx";
import SignInPage from "./pages/auth/SignInPage.jsx";
import SignUpPage from "./pages/auth/SignUpPage.jsx";

// Global Styles
import "./index.css";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/contactPage" element={<ContactPage />} />
        <Route path="/membershipPage" element={<MembershipPage />} />
        <Route path="/aboutUsPage" element={<AboutUsPage />} />
        <Route path="/coursesPage" element={<CoursesPage />} />
        <Route path="/resourcesPage" element={<ResourcesPage />} />
        <Route path="/faculties/:facultyId" element={<FacultiesDetails />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/UniversitiesTab" element={<UniversitiesTab />} />
        <Route path="/resources/universities" element={<UniversitiesTab />} />
      </Routes>

      <Footer />
    </Router>
  );
}

export default App;
