import Hero from "./pages/Hero";
import StatsBar from "./pages/StatsBar";
import Partners from "../../components/partners/Partners";
import WhyChoose from "./pages/WhyChoose";
import AcademicServices from "./pages/AcademicServices";
import GalleryTeaser from "./pages/GalleryTeaser";
import Testimonials from "./pages/Testimonials";
import CallToAction from "./pages/CallToAction";

const LandingPage = () => {
  return (
    <>
      <Hero />
      <StatsBar />
      <Partners />
      <WhyChoose />
      <AcademicServices />
      <GalleryTeaser />
      <Testimonials />
      <CallToAction />
    </>
  );
};

export default LandingPage;
