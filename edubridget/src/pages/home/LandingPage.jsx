import React from "react";

import AcademicServices from "./pages/AcademicServices";
import CallToAction from "./pages/CallToAction";
// import CoursesPreview from "./pages/CoursesPreview";
import Hero from "./pages/Hero";
// import MembershipPlans from "./pages/MembershipPlans";
import Testimonials from "./pages/Testimonials";
import WhyChoose from "./pages/WhyChoose";

const LandingPage = () => {
  return (
    <>
      <Hero />
      <WhyChoose />
      <AcademicServices />
      {/* <CoursesPreview /> */}
      {/* <MembershipPlans /> */}
      <Testimonials />
      <CallToAction />
    </>
  );
};

export default LandingPage;
