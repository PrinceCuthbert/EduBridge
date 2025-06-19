import "../css/footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        {/* TM EduBridge Branding Section */}
        <div className="footer-branding">
          <div className="footer-start">
            <h2>TM EduBridge</h2>
            <p>
              Empowering Africa through Knowledge. We provide quality education
              and resources to help students achieve their academic goals.
            </p>
          </div>

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
        <div className="footer-links">
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
            <li>
              <a href="#">Contact Us</a>
            </li>
          </ul>
        </div>

        {/* Contact Information Section */}
        <div className="footer-column">
          <h3 className="contact-us">Contact Us</h3>
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

        {/* Newsletter Subscription Section */}
        <div className="footer-newsletter">
          <h3>Newsletter</h3>
          <p>
            Subscribe to our newsletter for updates on new courses and
            educational resources.
          </p>
          <input type="email" placeholder="Enter your email" />
          <button className="subscribe-btn">Subscribe</button>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
