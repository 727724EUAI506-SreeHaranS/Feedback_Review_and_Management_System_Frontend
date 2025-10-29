import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
  };

  const handleRegister = () => {
    navigate('/register');
  };

  return (
    <div className="landing-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="floating-element-1"></div>
        <div className="floating-element-2"></div>
        <h1 className="hero-title">
          Welcome to Feedback Review & Management System
        </h1>
        <p className="hero-subtitle">
          Streamline your feedback collection and management process with our comprehensive platform.
          Submit feedback, track submissions, and manage reviews efficiently.
        </p>
        <div className="hero-buttons">
          <button onClick={handleLogin} className="btn-hero-primary">
            Login
          </button>
          <button onClick={handleRegister} className="btn-secondary">
            Register
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2 className="features-title">Key Features</h2>
        <div className="features-grid">
          <div className="feature-card feature-card-1">
            <h3>For Users</h3>
            <ul>
              <li>Submit detailed feedback with ratings</li>
              <li>View your past submissions</li>
              <li>Track feedback status</li>
              <li>Easy-to-use interface</li>
            </ul>
          </div>
          <div className="feature-card feature-card-2">
            <h3>For Admins</h3>
            <ul>
              <li>Review and manage all feedback</li>
              <li>Approve or reject submissions</li>
              <li>Delete inappropriate content</li>
              <li>Comprehensive dashboard</li>
            </ul>
          </div>
          <div className="feature-card feature-card-3">
            <h3>System Benefits</h3>
            <ul>
              <li>Streamlined feedback process</li>
              <li>Real-time status updates</li>
              <li>Secure user authentication</li>
              <li>Scalable architecture</li>
            </ul>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about-section">
        <h2 className="about-title">About Our System</h2>
        <div className="about-content">
          <p>
            Our Feedback Review and Management System bridges the gap between users and administrators,
            providing a seamless platform for collecting, reviewing, and managing feedback.
          </p>
          <p>
            Built with modern web technologies, our system ensures security, scalability, and a user-friendly
            experience. Join us in creating a better feedback ecosystem where every voice matters.
          </p>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section">
        <h2>Ready to Get Started?</h2>
        <p>Join our community of users and administrators.</p>
        <div className="cta-buttons">
          <button onClick={handleRegister} className="btn-cta-primary">
            Create Account
          </button>
          <button onClick={handleLogin} className="btn-cta-secondary">
            Login
          </button>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;