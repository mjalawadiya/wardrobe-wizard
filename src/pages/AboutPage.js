import React from 'react';
import { FaStore, FaUsers, FaAward, FaTshirt, FaHandshake, FaCode } from 'react-icons/fa';
import '../styles/pages/about.css';

const AboutPage = () => {
  return (
    <div className="about-container">
      <div className="about-header">
        <h1 className="about-title">About Wardrobe<span>Wizard</span></h1>
        <p className="about-subtitle">Your Personal Style Assistant</p>
      </div>
      
      <section className="about-section">
        <div className="section-header">
          <FaStore className="section-icon" />
          <h2 className="section-title">Our Story</h2>
        </div>
        <div className="section-content">
          <p>WardrobeWizard was founded in 2025 with a simple mission: to make fashion accessible, 
          personalized, and stress-free for everyone. What started as a small online store has 
          grown into a platform that combines technology and fashion to create a unique shopping experience.</p>
          
          <p>We believe that finding clothes that match your style, fit well, and make you feel 
          confident shouldn't be a challenge. That's why we've developed innovative features 
          like weather-based recommendations and personalized style profiles to help you navigate 
          the world of fashion with ease.</p>
        </div>
      </section>
      
      <section className="about-section">
        <div className="section-header">
          <FaTshirt className="section-icon" />
          <h2 className="section-title">Our Products</h2>
        </div>
        <div className="section-content">
          <p>At WardrobeWizard, we curate a collection of high-quality, versatile clothing items 
          that can be mixed and matched to create countless outfits. We partner with sustainable 
          manufacturers who share our commitment to ethical production practices and quality craftsmanship.</p>
          
          <p>Every item in our store is carefully selected based on quality, comfort, style, and 
          versatility. We offer a range of sizes and fits to ensure that everyone can find 
          clothes that make them look and feel their best.</p>
        </div>
      </section>
      
      <section className="about-section">
        <div className="section-header">
          <FaCode className="section-icon" />
          <h2 className="section-title">Technology Stack</h2>
        </div>
        <div className="section-content">
          <p>WardrobeWizard is built using cutting-edge technologies to provide a seamless and 
          innovative shopping experience:</p>
          
          <div className="tech-grid">
            <div className="tech-item">
              <h3>Frontend</h3>
              <ul>
                <li>React.js</li>
                <li>CSS3 with Flexbox/Grid</li>
                <li>React Icons</li>
                <li>Axios for API calls</li>
              </ul>
            </div>
            <div className="tech-item">
              <h3>Backend</h3>
              <ul>
                <li>Node.js</li>
                <li>Express.js</li>
                <li>MongoDB</li>
                <li>JWT Authentication</li>
              </ul>
            </div>
            <div className="tech-item">
              <h3>AI Features</h3>
              <ul>
                <li>Virtual Try-On Model</li>
                <li>Image Processing APIs</li>
                <li>Recommendation Engine</li>
              </ul>
            </div>
            <div className="tech-item">
              <h3>DevOps & Tools</h3>
              <ul>
                <li>Git & GitHub</li>
                <li>RESTful APIs</li>
                <li>Responsive Design</li>
                <li>Cross-browser compatibility</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      
      <section className="about-section">
        <div className="section-header">
          <FaUsers className="section-icon" />
          <h2 className="section-title">Our Team</h2>
        </div>
        <div className="section-content team-grid">
          <div className="team-member">
            <div className="member-avatar">AE</div>
            <h3>Ammar Engineer</h3>
            <p>Backend Developement and Integration</p>
          </div>
          <div className="team-member">
            <div className="member-avatar">UJ</div>
            <h3>Umed Jogi</h3>
            <p>Virtual Try On Model and Image Processing</p>
          </div>
          <div className="team-member">
            <div className="member-avatar">MJ</div>
            <h3>Mehek Jalawadiya</h3>
            <p>Frontend Developement (UI/UX Design)</p>
          </div>
          <div className="team-member">
            <div className="member-avatar">ML</div>
            <h3>Maria Lokhandwala</h3>
            <p>API Handling and Database Management</p>
          </div>
        </div>
      </section>
      
      <section className="about-section">
        <div className="section-header">
          <FaAward className="section-icon" />
          <h2 className="section-title">Our Values</h2>
        </div>
        <div className="section-content values-grid">
          <div className="value-item">
            <h3>Customer Satisfaction</h3>
            <p>We put our customers first and strive to exceed expectations in every interaction.</p>
          </div>
          <div className="value-item">
            <h3>Quality</h3>
            <p>We never compromise on quality, offering only the best products that will last.</p>
          </div>
          <div className="value-item">
            <h3>Sustainability</h3>
            <p>We're committed to reducing our environmental impact through responsible practices.</p>
          </div>
          <div className="value-item">
            <h3>Innovation</h3>
            <p>We continuously explore new ways to improve the shopping experience.</p>
          </div>
        </div>
      </section>
      
      <section className="about-section">
        <div className="section-header">
          <FaHandshake className="section-icon" />
          <h2 className="section-title">Join Our Community</h2>
        </div>
        <div className="section-content">
          <p>We're more than just an online store – we're a community of fashion enthusiasts who share 
          style tips, outfit ideas, and shopping advice. Join us on social media to connect with 
          like-minded individuals and stay updated on the latest trends and promotions.</p>
          
          <div className="social-buttons">
            <a href="#" className="social-button">Facebook</a>
            <a href="#" className="social-button">Instagram</a>
            <a href="#" className="social-button">Twitter</a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage; 