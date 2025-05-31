function AboutUsPage() {
  return (
    <div className="about-page">
      <section className="intro">
        <h1 className="intro-title">About TM EduBridge</h1>
        <p className="tagline">
          Empowering Africa through knowledge, innovation, and accessible
          education
        </p>
      </section>

      <section className="vision-mission">
        <div className="vision">
          <h2>Our Vision</h2>
          <p>
            To create a pan-African educational platform that breaks barriers to
            quality education, enabling every African student to access
            world-class learning regardless of geographical or economic
            constraints.
          </p>
        </div>
        <div className="mission">
          <h2>Our Mission</h2>
          <p>
            TM EduBridge is committed to providing comprehensive, accessible,
            and affordable educational resources tailored to the needs of
            African students. We aim to bridge educational gaps by offering
            high-quality courses, materials, and mentorship that empower
            students to excel academically and professionally.
          </p>
        </div>
      </section>

      <section className="founder-message">
        <h2>Founder's Message</h2>
        <p className="subheading">A personal note from our visionary founder</p>
        <div className="founder-content">
          <div className="founder-profile">
            <img src="/zino.jpg" alt="Founder" className="founder-image" />
            <div className="social-media">
              <i className="fab fa-facebook-f"></i>
              <i className="fab fa-twitter"></i>
              <i className="fab fa-instagram"></i>
              <i className="fab fa-linkedin-in"></i>
            </div>
          </div>

          <div className="message-text">
            <p>Dear Students, Parents, and Educators,</p>
            <br></br>
            <p>
              Welcome to TM EduBridge Online Academy. My journey to establishing
              this platform began with a simple observation: across Africa,
              quality educational resources remain inaccessible to many talented
              students eager to learn and grow.
            </p>
            <br></br>
            <p>
              After having personally benefited from the transformative power of
              education in my own life, I became passionate about creating a
              solution that could bridge this educational gap. I envisioned a
              platform where a student in a remote village in Rwanda could have
              the same quality educational experience as one in an urban center.
            </p>
            <br></br>
            <p>
              TM EduBridge was born from this vision — a comprehensive online
              academy that brings together courses, materials, and resources
              tailored to the educational needs of African students. From high
              school materials organized by country and curriculum to
              specialized courses in Korean language, programming, and
              university subjects, our platform aims to be a one-stop
              educational solution.
            </p>
            <br></br>
            <p>
              What began as a small initiative has grown into a vibrant learning
              community with students from across the continent. Our team of
              dedicated educators shares my passion for accessible education and
              works tirelessly to create engaging, relevant content that helps
              students excel.
            </p>
            <br></br>
            <p>
              As we continue to grow, our commitment remains unchanged: to
              empower Africa through knowledge. We believe that education is the
              most powerful tool for individual and societal transformation, and
              we are dedicated to making quality education accessible to all.
            </p>
            <br></br>
            <p>
              I invite you to join us on this educational journey. Whether
              you're a student seeking resources, a parent supporting your
              child's education, or an educator looking to contribute your
              expertise, there's a place for you in our community.
            </p>
            <br></br>
            <p>Together, let's build a brighter future through education.</p>
            <br></br>
            <p>
              <strong>Warm regards,</strong>
              <br />
              <strong>Adolphe NIYIGENA</strong>
              <br />
              <strong>Founder & CEO</strong>
            </p>
          </div>
        </div>
      </section>

      <section className="core-values">
        <h2>Our Core Values</h2>
        <p>These principles guide everything we do at TM EduBridge</p>
        <div className="value-cards">
          <div className="card">
            <i className="fas fa-graduation-cap"></i>
            <h3>Quality Education</h3>
            <p>
              We are committed to providing the highest quality educational
              resources and experiences.
            </p>
          </div>
          <div className="card">
            <i className="fas fa-star"></i>
            <h3>Excellence</h3>
            <p>
              We strive for excellence in everything we do — from course content
              to student support.
            </p>
          </div>
          <div className="card">
            <i className="fas fa-universal-access"></i>
            <h3>Accessibility</h3>
            <p>
              We believe education should be accessible to all, regardless of
              location or income.
            </p>
          </div>
        </div>
      </section>

      <section className="team-section">
        <h2 className="team-title">Meet Our Team</h2>
        <p className="team-subtitle">
          Dedicated educators and professionals committed to our mission
        </p>

        <div className="team-members">
          <div className="team-card">
            <img src="/zino.jpg" alt="Adolphe NIYIGENA" />
            <h3>Adolphe NIYIGENA</h3>
            <p className="role blue">Founder & CEO</p>
            <p>
              Educational visionary with a passion for making quality education
              accessible to all African students.
            </p>
          </div>
          <div className="team-card">
            <img src="/ehsan-ahmadi.jpg" alt="Grace Mutoni" />
            <h3>Grace Mutoni</h3>
            <p className="role blue">Head of Korean Language</p>
            <p>
              Korean language expert with years of teaching experience both in
              Korea and across Africa.
            </p>
          </div>
          <div className="team-card">
            <img src="/alexander.jpg" alt="David Kamau" />
            <h3>David Kamau</h3>
            <p className="role blue">Lead Programming Instructor</p>
            <p>
              Software engineer with a passion for teaching coding to the next
              generation of African developers.
            </p>
          </div>
          <div className="team-card">
            <img src="/vinicius.jpg" alt="Sarah Okello" />
            <h3>Vinicius Okello</h3>
            <p className="role blue">Academic Director</p>
            <p>
              Education specialist with expertise in curriculum development and
              educational policy.
            </p>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-content">
          {/* TM EduBridge Branding Section */}
          <div className="footer-column footer-branding">
            <h2 className="footer-logo">
              TM <span>EduBridge</span>
            </h2>
            <p className="footer-description">
              Empowering Africa through Knowledge. We provide quality education
              and resources to help students achieve their academic goals.
            </p>
            <div className="social-icons">
              <a
                href="https://github.com/PrinceCuthbert/africa-learn-bridge-online?tab=readme-ov-file"
                target="_blank">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a
                href="https://github.com/PrinceCuthbert/africa-learn-bridge-online?tab=readme-ov-file"
                target="_blank">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="https://www.instagram.com/tmedubridge/" target="_blank">
                <i className="fab fa-instagram"></i>
              </a>
              <a
                href="https://github.com/PrinceCuthbert/africa-learn-bridge-online?tab=readme-ov-file"
                target="_blank">
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
          </div>

          {/* Quick Links Section */}
          <div className="footer-column">
            <h3>Quick Links</h3>
            <ul>
              <li>
                <a href="#">Courses</a>
              </li>
              <li>
                <a href="#">High School Materials</a>
              </li>
              <li>
                <a href="#">Famous Books</a>
              </li>
              <li>
                <a href="#">Membership Plans</a>
              </li>
              <li>
                <a href="#">About Us</a>
              </li>
            </ul>
          </div>

          {/* Contact Section */}
          <div className="footer-column">
            <h3>Contact Us</h3>
            <p>
              <i className="fas fa-map-marker-alt"></i> 123 Education Street,
              Kigali, Rwanda
            </p>
            <p>
              <i className="fas fa-phone-alt"></i> +250 12 345 6789
            </p>
            <p>
              <i className="fas fa-envelope"></i> info@edubridge.com
            </p>
          </div>

          {/* Newsletter Section */}
          <div className="footer-column newsletter-column">
            <h3>Newsletter</h3>
            <p>
              Subscribe to our newsletter for updates on new courses and
              educational resources.
            </p>
            <div className="newsletter-form">
              <input type="email" placeholder="Your email address" />
              <button className="subscribe-btn">Subscribe</button>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2025 TM EduBridge Online Academy. All rights reserved.</p>
          <div className="footer-links-inline">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>FAQ</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default AboutUsPage;
