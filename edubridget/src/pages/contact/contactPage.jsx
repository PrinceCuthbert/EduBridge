import React from "react";
import Footer from "../footer/footer.jsx";

function ContactPage() {
  const question = [
    {
      question: "How do I sign up for courses?",
      answer:
        "To sign up for courses, create an account on our platform, browse our course catalog, select your desired course, and proceed to enrollment. Payment options will vary based on the course and your membership plan.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept various payment methods including credit/debit cards, mobile money (MTN MoMo, Airtel Money), and bank transfers for institutional enrollments. All payments are processed securely..",
    },
    {
      question: "Are there any free resources available?",
      answer:
        "Yes, we offer some free resources including sample course materials, educational articles, and limited access to basic study materials. Create a free account to access these resources.",
    },
    {
      question: "How do I access live classes?",
      answer:
        "Live classes are conducted via Zoom or Google Meet. Once enrolled in a course with live sessions, you'll receive email notifications with join links before each scheduled class.",
    },
    {
      question: "Can I download study materials for offline use?",
      answer:
        "Yes, most study materials can be downloaded for offline use. This feature is available to all paid members, with download limits varying by membership plan.",
    },
  ];
  return (
    <div className="contact-page ">
      <section className="contact-intro">
        <h1 className="contact-intro-title">Contact Us</h1>
        <p className="description">
          Have questions or need assistance? We're here to help you on your
          educational journey.
        </p>
      </section>

      <section className="contact-cards">
        <div className="contact-card">
          <div className="icon phone" role="img" aria-label="Phone">
            &#128222;
          </div>
          <h3>Phone</h3>
          <a href="tel:+250123456789">+250 12 345 6789</a>
          <p>Monday to Friday, 9am to 5pm EAT</p>
        </div>

        <div className="contact-card">
          <div className="icon email" role="img" aria-label="Email">
            &#9993;
          </div>
          <h3>Email</h3>
          <a href="mailto:info@edubridge.com">info@edubridge.com</a>
          <p>We'll respond within 24 hours</p>
        </div>

        <div className="contact-card">
          <div className="icon location" role="img" aria-label="Location">
            &#128205;
          </div>
          <h3>Office</h3>
          <a href="#">123 Education Street, Kigali, Rwanda</a>
          <p>Come say hello at our headquarters</p>
        </div>
      </section>

      <section>
        <div className="contact-support-section">
          {/* Message Form */}
          <div className="message-form">
            <h2>Send Us a Message</h2>
            <p>
              Fill out the form below and our team will get back to you as soon
              as possible.
            </p>

            <form>
              <div className="row">
                <input type="text" placeholder="Your first name" />
                <input type="text" placeholder="Your last name" />
              </div>
              <input
                type="email"
                placeholder="Your email address"
                className="inputText"
              />
              <input
                type="text"
                placeholder="How can we help you?"
                className="inputText"
              />
              <textarea placeholder="Your message..." rows={5}></textarea>{" "}
              {/* CHANGED: rows="5" to rows={5} */}
              <button type="submit">Send Message</button>
            </form>
          </div>

          {/* Support Options */}
          <div className="support-options">
            <h2>Support Options</h2>
            <p>
              We offer multiple ways to get the support you need for a smooth
              learning experience.
            </p>

            <div className="support-card">
              <div className="icon blue">💬</div>
              <div>
                <h4>Live Chat</h4>
                <p>
                  Chat with our support team in real-time for immediate
                  assistance.
                </p>
                <a href="#" className="link-blue">
                  Start a chat
                </a>
              </div>
            </div>

            <div className="support-card">
              <div className="icon green">❓</div>
              <div>
                <h4>Help Center</h4>
                <p>
                  Browse our comprehensive knowledge base for tutorials and
                  guides.
                </p>
                <a href="#" className="link-green">
                  Visit help center
                </a>
              </div>
            </div>

            <div className="support-card">
              <div className="icon orange">🕒</div>
              <div>
                <h4>Scheduled Call</h4>
                <p>
                  Book a call with our support team at your convenient time.
                </p>
                <a href="#" className="link-orange">
                  Schedule a call
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="question-section">
        <div className="faq-section">
          <div className="member_title">
            <h1>Frequently Asked Questions</h1>
          </div>
          <div className="faq-list ">
            {question.map(
              (
                q,
                idx // CHANGED: variable name from question to q to avoid shadowing
              ) => (
                <div key={idx} className="faq-item contact-questions">
                  <h3 className="faq-question">{q.question}</h3>
                  <p className="faq-answer">{q.answer}</p>
                </div>
              )
            )}
          </div>
        </div>
        <div className="questions-end">
          <p>Still have questions?</p>
          <button className="question-button">
            <a href="#">Contact Our Support Team</a>{" "}
            {/* CHANGED: added href="#" to <a> */}
          </button>
        </div>
      </section>

      <section className="find-us-section">
        <h2 className="section-title">Find Us</h2>
        <p className="section-subtitle">
          Visit our headquarters in Kigali, Rwanda
        </p>
        <div className="map-container">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3163.0450160559456!2d126.97796901567522!3d37.56653597979814!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x357ca2e5c11e8b81%3A0x34bd74c801a7dbf6!2sSeoul%2C%20South%20Korea!5e0!3m2!1sen!2skr!4v1686509876543!5m2!1sen!2skr"
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"></iframe>
        </div>
      </section>
      <section>
        <div>
          {/* Your Contact page content here */}

          {/* Footer at the bottom */}
          <Footer />
        </div>
      </section>
    </div>
  );
}

export default ContactPage;
