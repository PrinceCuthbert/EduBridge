import React from "react";

const ApplicationProcess = ({ t }) => {
  const processSteps = ["consultation", "search", "application", "visa"];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-slate-900">
            {t("study_abroad_page.process.title")}
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            {t("study_abroad_page.process.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {processSteps.map((stepKey, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 bg-primary-gradient rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 shadow-lg">
                {index + 1}
              </div>
              <h3 className="font-semibold text-lg mb-2 text-slate-900">
                {t(`study_abroad_page.process.steps.${stepKey}.title`)}
              </h3>
              <p className="text-slate-600 text-sm">
                {t(`study_abroad_page.process.steps.${stepKey}.desc`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ApplicationProcess;
