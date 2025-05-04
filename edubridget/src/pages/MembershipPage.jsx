function MembershipPage() {
  const plans = [
    {
      planName: "Free Plan",
      description: "Basic access to educational resources",
      price: "$0",
      features: [
        "Limited course previews",
        "Access to basic study materials",
        "Community forum access",
        "Full course access",
        "Certificates",
      ],
      disabledFeatures: ["Full course access", "Certificates"],
      buttonText: "Sign Up Free",
    },
    {
      planName: "Pro Plan",
      description: "Unlock full courses and exclusive content",
      price: "$9.99",
      features: [
        "Unlimited course access",
        "Exclusive webinars",
        "Downloadable materials",
        "Community forum access",
        "Certificates",
      ],
      disabledFeatures: [],
      buttonText: "Get Pro Acess",
    },
    {
      planName: "Premium Plan",
      description: "All features plus 1-on-1 mentorship",
      price: "$19.99",
      features: [
        "All Pro features",
        "1-on-1 Mentorship",
        "Live support",
        "Career advice",
        "Priority certificates",
      ],
      disabledFeatures: [],
      buttonText: "Get Premium Access",
    },
  ];
  const testimonials = [
    {
      text: "EduBridge has transformed my learning experience. The courses are amazing!",
      author: "John Doe",
      stars: 5,
      avatar: "publicheadshot.png", // Replace with actual avatar URL
      plan: "Premium Plan",
    },
    {
      text: "The mentorship program helped me land my dream job. Highly recommend!",
      author: "Jane Smith",
      stars: 4,
      avatar: "public/zino.jpg", // Replace with actual avatar URL
      plan: "Pro Plan",
    },
    {
      text: "Affordable and high-quality education. I love the flexibility it offers.",
      author: "Samuel Green",
      stars: 5,
      avatar: "public/zino.jpg", // Replace with actual avatar URL
      plan: "Free Plan",
    },
  ];

  const questions = [
    {
      question: "Can I cancel my subscription anytime?",
      answer:
        "Yes, you can cancel your subscription at any time. Your access will continue until the end of your billing period.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit cards, PayPal, and other secure payment methods.",
    },
    {
      question: "Is there a free trial available?",
      answer: "Yes, we offer a 7-day free trial for our Pro and Premium plans.",
    },
    {
      question: "Can I upgrade or downgrade my plan later?",
      answer:
        "Absolutely! You can upgrade or downgrade your plan at any time from your account settings.",
    },
  ];

  return (
    <div className="membershipSection">
      <div className="member_title">
        <h1>Membership Plans</h1>
        <p>
          Choose the plan that best suits your educational needs and budget.
        </p>
      </div>
      <div className="membership-cards-wrapper">
        {plans.map((plan, idx) => (
          <MembershipCard key={idx} {...plan} />
        ))}
      </div>
      <div className="testimonials-section">
        <div className="member_title">
          <h1>What Our Members Say</h1>
          <p>Hear from our satisfied members about their experiences.</p>
        </div>
        <div className="testimonials">
          {testimonials.map((testimonial, idx) => (
            <div key={idx} className="testimonial-card">
              {/* Review Stars */}
              <div className="review-stars">
                {"★".repeat(testimonial.stars)}{" "}
                {"☆".repeat(5 - testimonial.stars)}
              </div>
              {/* Review Text */}
              <p className="testimonial-text">"{testimonial.text}"</p>
              {/* User Info */}
              <div className="user-info">
                <img
                  src={testimonial.avatar}
                  alt={`${testimonial.author}'s avatar`}
                  className="user-avatar"
                />
                <div>
                  <p className="testimonial-author">{testimonial.author}</p>
                  <p className="user-plan">{testimonial.plan}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="faq-section">
        <div className="member_title">
          <h1>Frequently Asked Questions</h1>
        </div>
        <div className="faq-list">
          {questions.map((question, idx) => (
            <div key={idx} className="faq-item">
              <h3 className="faq-question">{question.question}</h3>
              <p className="faq-answer">{question.answer}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="end-section">
        <h1>Ready to Advance Your Education?</h1>
        <p>
          Join thousands of students who are already benefiting from our
          comprehensive learning resources.
        </p>
        <div className="end-buttons">
          <button className="choose-plan-btn">Choose Your Plan</button>
          <button className="learn-more-btn">Learn more</button>
        </div>
      </div>
    </div>
  );
}

function MembershipCard({
  planName,
  description,
  price,
  features,
  buttonText,
  disabledFeatures,
}) {
  return (
    <div className="membership-card">
      <div className="membership-header">
        <p className="plan-name">{planName}</p>
        <p className="plan-desc">{description}</p>
        <p className="plan-price">
          <span className="price-amount">{price}</span> /month
        </p>
        <hr />
      </div>
      <div className="membership-body">
        <ul className="features">
          {features.map((feature, index) => (
            <li
              key={index}
              className={disabledFeatures.includes(feature) ? "disabled" : ""}>
              {feature}
            </li>
          ))}
        </ul>
        <button className="signup-btn">{buttonText}</button>
      </div>
    </div>
  );
}

export default MembershipPage;
