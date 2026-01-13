import React from 'react';
import { Check, X } from 'react-feather';

const MembershipPlans = () => {
  const plans = [
    {
      planName: "Free Plan",
      description: "Basic access to educational resources",
      price: "0",
      features: [
        "Limited course previews",
        "Access to basic study materials",
        "Community forum access",
      ],
      disabledFeatures: [
        "Full course access",
        "Certificates",
      ],
      buttonText: "Sign Up Free",
      isPopular: false,
    },
    {
      planName: "Pro Plan",
      description: "Unlock full courses and exclusive content",
      price: "9.99",
      features: [
        "Unlimited course access",
        "Exclusive webinars",
        "Downloadable materials",
        "Community forum access",
        "Certificates",
      ],
      disabledFeatures: [],
      buttonText: "Get Pro",
      isPopular: true,
    },
    {
      planName: "Premium Plan",
      description: "All features plus 1-on-1 mentorship",
      price: "19.99",
      features: [
        "All Pro features",
        "1-on-1 Mentorship",
        "Live support",
        "Career advice",
        "Priority certificates",
      ],
      disabledFeatures: [],
      buttonText: "Go Premium",
      isPopular: false,
    },
  ];

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 font-primary">
            Membership Plans
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            Choose the plan that best suits your educational needs and budget.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {plans.map((plan, index) => (
            <div 
              key={index} 
              className={`relative p-8 rounded-[2.5rem] border transition-all duration-300 flex flex-col h-full ${
                plan.isPopular 
                  ? 'border-primary shadow-2xl shadow-primary/10 scale-105 z-10 bg-slate-900 text-white' 
                  : 'border-slate-100 bg-white hover:border-primary/20 hover:shadow-xl hover:shadow-slate-100'
              }`}
            >
              {plan.isPopular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-white text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg">
                  Most Popular
                </div>
              )}

              <div className="mb-8">
                <h3 className={`text-2xl font-bold mb-2 ${plan.isPopular ? 'text-white' : 'text-slate-900'}`}>
                  {plan.planName}
                </h3>
                <p className={`text-sm ${plan.isPopular ? 'text-slate-400' : 'text-slate-500'}`}>
                  {plan.description}
                </p>
              </div>

              <div className="mb-8">
                <div className="flex items-baseline gap-1">
                  <span className={`text-4xl font-extrabold ${plan.isPopular ? 'text-white' : 'text-slate-900'}`}>
                    ${plan.price}
                  </span>
                  <span className={`text-sm ${plan.isPopular ? 'text-slate-400' : 'text-slate-500'}`}>
                    /month
                  </span>
                </div>
              </div>

              <div className="flex-grow space-y-4 mb-10">
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className={`mt-1 p-0.5 rounded-full ${plan.isPopular ? 'bg-primary/20 text-primary-light' : 'bg-blue-50 text-primary'}`}>
                      <Check size={14} />
                    </div>
                    <span className={`text-sm font-medium ${plan.isPopular ? 'text-slate-300' : 'text-slate-600'}`}>
                      {feature}
                    </span>
                  </div>
                ))}
                {plan.disabledFeatures.map((feature, i) => (
                  <div key={i} className="flex items-start gap-3 opacity-40">
                    <div className={`mt-1 p-0.5 rounded-full ${plan.isPopular ? 'bg-slate-700 text-slate-500' : 'bg-slate-100 text-slate-400'}`}>
                      <X size={14} />
                    </div>
                    <span className={`text-sm font-medium ${plan.isPopular ? 'text-slate-400' : 'text-slate-500'} line-through`}>
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              <button 
                className={`w-full py-4 rounded-2xl font-bold transition-all active:scale-95 shadow-lg ${
                  plan.isPopular 
                    ? 'bg-primary text-white hover:bg-primary-dark shadow-primary-dark/40' 
                    : 'bg-slate-900 text-white hover:bg-slate-800 shadow-slate-200'
                }`}
              >
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MembershipPlans;
