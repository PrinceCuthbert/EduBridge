import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faTimes,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import FAQSection from "../../components/FAQSection";
import { faqs } from "../../data/faqData";

function MembershipPage() {
  const [billingCycle, setBillingCycle] = useState("monthly"); // "monthly" or "yearly"

  const plans = [
    {
      id: "free",
      name: "Free Access",
      description: "Basic access to educational resources",
      monthlyPrice: 0,
      yearlyPrice: 0,
      features: [
        { text: "Basic educational materials", included: true },
        { text: "Limited access to high school resources", included: true },
        { text: "Public blog articles", included: true },
        { text: "Basic Korean vocabulary lessons", included: true },
        { text: "Full course access", included: false },
        { text: "Certificates", included: false },
      ],
      buttonText: "Get Started",
      buttonStyle: "outline",
    },
    {
      id: "basic",
      name: "Basic Plan",
      description: "Unlock full courses and exclusive content",
      monthlyPrice: 9.99,
      yearlyPrice: 99.99,
      popular: true,
      features: [
        { text: "Everything in Free Plan", included: true },
        { text: "Full access to high school materials", included: true },
        { text: "Basic Korean language courses", included: true },
        { text: "Downloadable study resources", included: true },
        { text: "Intro programming tutorials", included: true },
        { text: "Monthly live Q&A sessions", included: true },
      ],
      buttonText: "Subscribe Now",
      buttonStyle: "primary",
    },
    {
      id: "premium",
      name: "Premium Plan",
      description: "All features plus 1-on-1 mentorship",
      monthlyPrice: 24.99,
      yearlyPrice: 249.99,
      features: [
        { text: "Everything in Basic Plan", included: true },
        { text: "All premium Korean language courses", included: true },
        { text: "Full programming course library", included: true },
        { text: "University course materials", included: true },
        { text: "1-on-1 mentoring sessions", included: true },
        { text: "Certification preparation", included: true },
      ],
      buttonText: "Get Premium Access",
      buttonStyle: "success",
    },
  ];

  const testimonials = [
    {
      id: 1,
      text: "The Korean language courses have been incredible. I was able to achieve conversational fluency in just 6 months with the structured lessons.",
      author: "Jean Doe",
      role: "Basic Plan Member",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
    },
    {
      id: 2,
      text: "As a teacher, I've found the high school materials to be extremely comprehensive. They have saved me countless hours in preparation time.",
      author: "Sarah Kim",
      role: "Premium Plan Member",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
    },
    {
      id: 3,
      text: "The programming courses helped me transition into tech from a completely different field. Now I'm working as a junior developer thanks to TM EduBridge!",
      author: "Michael Nkunzi",
      role: "Premium Plan Member",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop",
    },
  ];

  const getPrice = (plan) => {
    if (plan.monthlyPrice === 0) return "$0";
    const price = billingCycle === "monthly" ? plan.monthlyPrice : plan.yearlyPrice;
    return `$${price.toFixed(2)}`;
  };

  const getPeriod = () => {
    return billingCycle === "monthly" ? "/month" : "/year";
  };

  const getSavings = (plan) => {
    if (plan.monthlyPrice === 0 || billingCycle === "monthly") return null;
    const monthlyCost = plan.monthlyPrice * 12;
    const yearlyCost = plan.yearlyPrice;
    const savings = monthlyCost - yearlyCost;
    return `Save $${savings.toFixed(2)}`;
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-primary-gradient">
        <div className="absolute top-0 left-0 -translate-y-1/4 -translate-x-1/4 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl opacity-60 pointer-events-none" />
        <div className="container mx-auto px-6 relative z-10 text-center text-white">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight mb-6 font-serif">
            Membership Plans
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed mb-8">
            Choose the right membership plan for your educational journey. Unlock premium content and resources to accelerate your learning.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-full p-2 border border-white/20">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-6 py-2.5 rounded-full font-medium text-sm transition-all ${
                billingCycle === "monthly"
                  ? "bg-white text-primary shadow-lg"
                  : "text-white hover:bg-white/10"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={`px-6 py-2.5 rounded-full font-medium text-sm transition-all flex items-center gap-2 ${
                billingCycle === "yearly"
                  ? "bg-white text-primary shadow-lg"
                  : "text-white hover:bg-white/10"
              }`}
            >
              Yearly
              <span className="px-2 py-0.5 bg-secondary text-white text-xs rounded-full">
                Save 17%
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16 -mt-20 relative z-10">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`bg-white rounded-[2rem] p-8 border transition-all duration-300 ${
                  plan.popular
                    ? "border-primary shadow-2xl shadow-primary/20 scale-105 md:scale-110 relative"
                    : "border-slate-200 hover:shadow-xl hover:border-primary/30"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="px-4 py-1.5 bg-primary text-white text-sm font-bold rounded-full shadow-lg">
                      Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                  <p className="text-slate-600 text-sm mb-6">{plan.description}</p>
                  
                  <div className="mb-2">
                    <span className="text-3xl font-extrabold text-slate-900">
                      {getPrice(plan)}
                    </span>
                    {plan.monthlyPrice > 0 && (
                      <span className="text-slate-900 text-lg ml-1">{getPeriod()}</span>
                    )}
                  </div>
                  
                  {getSavings(plan) && (
                    <p className="text-secondary font-medium text-sm">{getSavings(plan)}</p>
                  )}
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                          feature.included
                            ? "bg-secondary/10 text-secondary"
                            : "bg-slate-100 text-slate-400"
                        }`}
                      >
                        <FontAwesomeIcon
                          icon={feature.included ? faCheck : faTimes}
                          className="text-xs"
                        />
                      </div>
                      <span
                        className={`text-sm ${
                          feature.included ? "text-slate-700" : "text-slate-400"
                        }`}
                      >
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>

                <button
                  className={`w-full py-3.5 rounded-xl font-bold transition-all ${
                    plan.buttonStyle === "primary"
                      ? "bg-primary text-white hover:bg-primary-dark shadow-lg shadow-primary/20 hover:shadow-xl"
                      : plan.buttonStyle === "success"
                      ? "bg-secondary text-white hover:bg-secondary-dark shadow-lg shadow-secondary/20 hover:shadow-xl"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
                  }`}
                >
                  {plan.buttonText}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              What Our Members Say
            </h2>
            <p className="text-lg text-slate-600">
              Hear from our satisfied members about their experiences
            </p>
          </div>

          
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-slate-50 p-8 rounded-3xl border border-slate-100 hover:border-primary/20 transition-all"
              >
                    <div className="flex gap-1 text-secondary mb-4">
                      {[...Array(5)].map((_, i) => (
                        <FontAwesomeIcon key={i} icon={faStar} className="text-xs" />
                      ))}
                    </div>
                    <p className="text-slate-700 mb-6 italic">"{testimonial.text}"</p>
                    <div className="flex items-center gap-4">
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.author}
                        className="w-12 h-12 rounded-full object-cover border-2 border-primary/20"
                      />
                      <div>
                        <p className="font-bold text-slate-900">{testimonial.author}</p>
                        <p className="text-sm text-slate-500">{testimonial.role}</p>
                      </div>
                    </div>
              </div>
              
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQSection faqs={faqs} />

      {/* CTA Section */}
      <section className="py-16 bg-primary-gradient">
        <div className="container mx-auto px-6 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4 font-serif">
            Ready to Advance Your Education?
          </h2>
          <p className="text-lg text-white/90 max-w-2xl mx-auto mb-8">
            Join thousands of students who are already benefiting from our comprehensive learning resources.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button className="px-8 py-3.5 bg-white text-primary hover:bg-slate-100 font-bold rounded-xl transition-all shadow-lg">
              Choose Your Plan
            </button>
            <button className="px-8 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-all border border-white/20 backdrop-blur-sm">
              Learn More
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default MembershipPage;
