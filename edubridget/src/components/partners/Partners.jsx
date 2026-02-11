import Slider from "./Slider";
import { universityPartners as partners } from "../../data/partneringUni";

const Partners = () => {
  return (
    <section className="w-full bg-surface py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-gray-800">
          Our University Partners
        </h2>
        <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
          We collaborate with leading Korean universities to provide world-class
          education opportunities
        </p>
      </div>

      <Slider partners={partners} direction="left" bgColor="#f8fafc" />
    </section>
  );
};

export default Partners;
