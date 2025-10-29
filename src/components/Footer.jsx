import React from 'react';

const Footer = () => {
  return (
    <footer className="footer" style={{
      background: 'rgba(255, 255, 255, 0.15)',
      backdropFilter: 'blur(10px)',
      borderTop: '1px solid rgba(108, 99, 255, 0.1)',
      padding: '20px',
      textAlign: 'center',
      color: 'var(--subtext)',
      fontSize: '0.9rem'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <p style={{ margin: '0' }}>
          © 2025 Feedback App. Built with modern React & Vite.
        </p>
      </div>
    </footer>
  );
};

export default Footer;