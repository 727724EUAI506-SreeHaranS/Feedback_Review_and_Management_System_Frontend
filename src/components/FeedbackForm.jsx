import React, { useState } from 'react';
import { submitFeedback } from '../utils/api';
import LoadingSpinner from './LoadingSpinner';
import { motion } from 'framer-motion';

const FeedbackForm = () => {
  const [formData, setFormData] = useState({
    productId: '',
    rating: '',
    comment: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error on change
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.productId.trim()) newErrors.productId = 'Product ID is required';
    if (!formData.rating || formData.rating < 1 || formData.rating > 5) newErrors.rating = 'Rating must be between 1 and 5';
    if (!formData.comment.trim()) newErrors.comment = 'Comment is required';
    else if (formData.comment.trim().length < 10) newErrors.comment = 'Comment must be at least 10 characters';
    else if (formData.comment.trim().length > 500) newErrors.comment = 'Comment must not exceed 500 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setSuccess('');
    try {
      await submitFeedback(formData);
      setSuccess('Feedback submitted successfully!');
      setFormData({ productId: '', rating: '', comment: '' });
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to submit feedback';
      setErrors({ submit: message });
    } finally {
      setLoading(false);
    }
  };

  const StarRating = ({ rating, onRatingChange, disabled }) => {
    return (
      <div className="star-rating">
        {[1, 2, 3, 4, 5].map((star) => (
          <motion.button
            key={star}
            type="button"
            className={`star ${star <= rating ? 'active' : ''}`}
            onClick={() => !disabled && onRatingChange(star)}
            disabled={disabled}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          >
            ★
          </motion.button>
        ))}
        <span className="rating-text">{rating ? `${rating}/5` : 'Select rating'}</span>
      </div>
    );
  };

  return (
    <div className="feedback-form-container">
      <motion.div 
        className="feedback-form-card glass-card"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        data-aos="fade-up"
      >
        <div className="form-header">
          <h2 className="form-title">Share Your Experience</h2>
          <p className="form-subtitle">Your feedback helps us improve our products</p>
        </div>

        {success && (
          <motion.div 
            className="success-msg"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            ✅ {success}
          </motion.div>
        )}
        
        {errors.submit && (
          <motion.div 
            className="error-msg"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            ❌ {errors.submit}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="feedback-form">
          <motion.div 
            className="form-group"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <label className="label">Product ID</label>
            <input
              type="text"
              name="productId"
              value={formData.productId}
              onChange={handleChange}
              disabled={loading}
              className="input-field"
              placeholder="Enter product identifier..."
            />
            {errors.productId && (
              <motion.span 
                className="error-text"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {errors.productId}
              </motion.span>
            )}
          </motion.div>

          <motion.div 
            className="form-group"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <label className="label">Rating</label>
            <StarRating 
              rating={parseInt(formData.rating) || 0}
              onRatingChange={(rating) => {
                setFormData(prev => ({ ...prev, rating: rating.toString() }));
                if (errors.rating) setErrors(prev => ({ ...prev, rating: '' }));
              }}
              disabled={loading}
            />
            {errors.rating && (
              <motion.span 
                className="error-text"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {errors.rating}
              </motion.span>
            )}
          </motion.div>

          <motion.div 
            className="form-group"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <label className="label">Your Feedback</label>
            <textarea
              name="comment"
              value={formData.comment}
              onChange={handleChange}
              disabled={loading}
              rows="4"
              className="textarea-field"
              placeholder="Share your thoughts about this product..."
            />
            <div className="char-count">
              {formData.comment.length}/500 characters
            </div>
            {errors.comment && (
              <motion.span 
                className="error-text"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {errors.comment}
              </motion.span>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {loading ? (
              <LoadingSpinner text="Submitting your feedback..." />
            ) : (
              <button type="submit" className="btn-primary btn-ripple" disabled={loading}>
                🚀 Submit Feedback
              </button>
            )}
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
};

export default FeedbackForm;
