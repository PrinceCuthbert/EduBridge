import React from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import OptimizedImage from "@/components/OptimizedImage";

const UniversityCard = React.memo(({ university }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/study-abroad/${university.id}`)}
      className="flex-shrink-0 w-48 flex flex-col items-center group cursor-pointer p-2">
      <div className="w-24 h-24 rounded-full bg-white border border-slate-100 flex items-center justify-center mb-4 overflow-hidden relative shadow-sm group-hover:shadow-md transition-all">
        <OptimizedImage
          src={
            university.logo ||
            `https://ui-avatars.com/api/?name=${university.visaType}&background=random&color=fff&size=128&font-size=0.33`
          }
          alt={university.universityName}
          className="w-full h-full object-cover"
          rounded={true}
          showSkeleton={true}
        />
      </div>
      <div className="text-center w-full">
        <div className="text-[10px] text-slate-500 font-semibold mb-1 uppercase tracking-wider">
          {university.visaType}
        </div>
        <h3 className="font-bold text-xs text-slate-900 mb-2 line-clamp-2 min-h-[32px] px-1 leading-tight">
          {university.universityName}
        </h3>

        <div className="flex flex-col gap-1 items-center mt-1">
          {university.tags?.map((tag, i) => (
            <Badge
              key={i}
              variant="secondary"
              className={`
                  text-[10px] px-2 py-0.5 h-5
                  ${tag === "BEST" ? "bg-emerald-500 text-white hover:bg-emerald-600" : ""}
                  ${tag === "NEW" ? "bg-emerald-500 text-white hover:bg-emerald-600" : ""}
                  ${tag === "ON SALE" ? "bg-rose-500 text-white hover:bg-rose-600" : ""}
                `}>
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
});

export default UniversityCard;
