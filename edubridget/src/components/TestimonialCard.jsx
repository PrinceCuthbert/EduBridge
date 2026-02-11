import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuoteLeft } from "@fortawesome/free-solid-svg-icons";

export const TestimonialCard = ({
  name,
  location,
  text,
  image,
  className = "",
}) => {
  return (
    <div
      className={`bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 flex flex-col group ${className}`}>
      {/* Quote Icon */}
      <div className="mb-4 text-primary/20 group-hover:text-primary transition-colors duration-500">
        <FontAwesomeIcon icon={faQuoteLeft} className="text-2xl" />
      </div>

      {/* Feedback Text */}
      <blockquote className="text-slate-700 leading-relaxed mb-6 flex-grow italic text-base">
        "{text}"
      </blockquote>

      {/* User Info */}
      <div className="flex items-center gap-4 pt-6 border-t border-slate-50">
        <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white shadow-md">
          <img src={image} alt={name} className="w-full h-full object-cover" />
        </div>
        <div>
          <h4 className="font-bold text-slate-900">{name}</h4>
          <p className="text-sm text-slate-500">{location}</p>
        </div>
      </div>
    </div>
  );
};
