import React, { useState, useEffect } from 'react';
import { getUserFeedback } from '../utils/api';

const UserFeedbackList = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Clear messages after timeout
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError('');
        setSuccess('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  const handleSearch = async () => {
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const response = await getUserFeedback();
      
      if (!response || !response.data) {
        throw new Error('Invalid response from server');
      }
      
      const feedbackData = Array.isArray(response.data) ? response.data : [];
      setFeedbacks(feedbackData);
      
      if (feedbackData.length === 0) {
        setSuccess('No feedback found for this user.');
      } else {
        setSuccess(`Found ${feedbackData.length} feedback(s).`);
      }
    } catch (err) {
      console.error('Error fetching user feedback:', err);
      const message = err.response?.data?.message || err.message || 'Failed to fetch feedback';
      setError(message);
      setFeedbacks([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (isoDate) => {
    try {
      if (!isoDate) return 'N/A';
      const date = new Date(isoDate);
      if (isNaN(date.getTime())) return 'Invalid Date';
      return date.toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric'
      });
    } catch (error) {
      console.error('Date formatting error:', error);
      return 'N/A';
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h2>My Feedback</h2>
      <button onClick={handleSearch} disabled={loading} style={{ padding: '8px 16px', marginBottom: '20px' }}>
        {loading ? 'Loading...' : 'Load My Feedback'}
      </button>
      {error && <div style={{ color: 'red', background: '#f8d7da', padding: '10px', marginBottom: '10px' }}>{error}</div>}
      {success && <div style={{ color: 'green', background: '#d4edda', padding: '10px', marginBottom: '10px' }}>{success}</div>}
      {loading && <div style={{ textAlign: 'center' }}>Loading...</div>}
      {!loading && feedbacks.length > 0 && (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {feedbacks.map((feedback) => {
            if (!feedback || !feedback.id) {
              console.warn('Invalid feedback item:', feedback);
              return null;
            }
            return (
              <li key={feedback.id} style={{ border: '1px solid #ddd', marginBottom: '10px', padding: '15px', borderRadius: '5px' }}>
                <p><strong>Product ID:</strong> {feedback.productId || 'N/A'}</p>
                <p><strong>Rating:</strong> {feedback.rating || 'N/A'}</p>
                <p><strong>Comment:</strong> {feedback.comment || 'No comment'}</p>
                <p><strong>Status:</strong> {feedback.status || 'Unknown'}</p>
                <p><strong>Created:</strong> {formatDate(feedback.createdDate)}</p>
              </li>
            );
          }).filter(Boolean)}
        </ul>
      )}
    </div>
  );
};

export default UserFeedbackList;
