import React from "react";
import { DollarSign, MapPin, Plane } from "lucide-react";
import { Button } from "@/components/ui/button";

const LOADING_PROP = "lazy";

const DestinationCard = ({ destination, t }) => {
  return (
    <div className="hover:shadow-xl transition-shadow border-slate-200 bg-white overflow-hidden group rounded-2xl flex flex-col">
      <div className="h-48 overflow-hidden relative">
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors z-10" />
        <img
          src={destination.image}
          alt={destination.name}
          loading={LOADING_PROP}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-2xl font-bold mb-2 text-slate-900">
          {destination.name}
        </h3>
        <p className="text-slate-600 text-sm mb-4">{destination.description}</p>

        <div className="space-y-3 mb-6">
          <div className="flex items-start">
            <DollarSign className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-sm font-semibold text-slate-900">
                {t("study_abroad_page.destinations.tuition_fees")}
              </div>
              <div className="text-sm text-slate-600">
                {destination.tuition}
              </div>
            </div>
          </div>
          <div className="flex items-start">
            <MapPin className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-sm font-semibold text-slate-900">
                {t("study_abroad_page.destinations.living_costs")}
              </div>
              <div className="text-sm text-slate-600">{destination.living}</div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-4 mb-4 flex-grow">
          <h4 className="text-sm font-semibold mb-2 text-slate-900">
            {t("study_abroad_page.destinations.key_features")}
          </h4>
          <ul className="space-y-1">
            {destination.features.map((feature, idx) => (
              <li key={idx} className="text-sm text-slate-600 flex items-start">
                <span className="text-primary mr-2">•</span>
                {feature}
              </li>
            ))}
          </ul>
        </div>

        <Button className="w-full bg-primary hover:bg-primary-dark mt-auto">
          <Plane className="mr-2 h-4 w-4" />{" "}
          {t("study_abroad_page.destinations.learn_more")}
        </Button>
      </div>
    </div>
  );
};

export default DestinationCard;
