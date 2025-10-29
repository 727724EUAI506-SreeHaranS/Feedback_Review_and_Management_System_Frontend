import React from 'react';

const LoadingSpinner = ({ text = "Loading..." }) => {
  // Validate and sanitize text prop
  const safeText = typeof text === 'string' ? text.substring(0, 100) : 'Loading...';
  
  try {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px',
        gap: '20px'
      }}>
        <div className="spinner" role="status" aria-label="Loading"></div>
        <p style={{ 
          color: 'var(--subtext)', 
          fontSize: '1rem',
          margin: 0,
          animation: 'pulse 1.5s infinite'
        }}>
          {safeText}
        </p>
      </div>
    );
  } catch (error) {
    console.error('LoadingSpinner render error:', error);
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <p>Loading...</p>
      </div>
    );
  }
};

export default LoadingSpinner;