import React, { useState, useEffect } from 'react';
import { getAllFeedback, getFeedbackStats, getFeedbackProducts, updateFeedbackStatus, deleteFeedback } from '../utils/api';
import LoadingSpinner from './LoadingSpinner';
import UserManagement from './UserManagement';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('feedback');
  const [feedbacks, setFeedbacks] = useState([]);
  const [filteredFeedbacks, setFilteredFeedbacks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  });

  // Filter states
  const [filters, setFilters] = useState({
    status: 'ALL',
    rating: 'ALL',
    productId: '',
    searchTerm: ''
  });

  const fetchFeedbacks = async () => {
    setLoading(true);
    setError('');
    try {
      console.log('Fetching feedback data...');
      
      // Build filter params
      const params = {
        page: 0,
        size: 100,
        ...(filters.status !== 'ALL' && { status: filters.status }),
        ...(filters.rating !== 'ALL' && { rating: filters.rating }),
        ...(filters.productId && { productId: filters.productId }),
        ...(filters.searchTerm && { search: filters.searchTerm })
      };
      
      const [feedbackResponse, statsResponse] = await Promise.all([
        getAllFeedback(params),
        getFeedbackStats().catch(() => ({ data: null }))
      ]);
      
      let feedbackData = feedbackResponse.data;
      
      // Handle different response structures
      if (Array.isArray(feedbackData)) {
        // Direct array
      } else if (feedbackData && typeof feedbackData === 'object') {
        // Check common keys for the array
        if (Array.isArray(feedbackData.content)) {
          feedbackData = feedbackData.content; // Spring Boot pagination
        } else if (Array.isArray(feedbackData.data)) {
          feedbackData = feedbackData.data;
        } else if (Array.isArray(feedbackData.feedbacks)) {
          feedbackData = feedbackData.feedbacks;
        } else if (Array.isArray(feedbackData.results)) {
          feedbackData = feedbackData.results;
        } else {
          feedbackData = [];
        }
      } else {
        feedbackData = [];
      }

      console.log('Feedback data received:', feedbackData);
      setFeedbacks(feedbackData);
      setFilteredFeedbacks(feedbackData);

      // Use API stats if available, otherwise calculate locally
      if (statsResponse.data) {
        setStats({
          total: statsResponse.data.totalCount || 0,
          pending: statsResponse.data.statusDistribution?.PENDING || 0,
          approved: statsResponse.data.statusDistribution?.APPROVED || 0,
          rejected: statsResponse.data.statusDistribution?.REJECTED || 0
        });
      } else {
        // Fallback to local calculation
        const localStats = feedbackData.reduce((acc, feedback) => {
          acc.total++;
          acc[feedback.status.toLowerCase()]++;
          return acc;
        }, { total: 0, pending: 0, approved: 0, rejected: 0 });
        setStats(localStats);
      }
    } catch (err) {
      console.error('Error fetching feedback:', err);
      setError(err.response?.data?.message || 'Failed to fetch feedback. Please check if the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  const addSampleData = () => {
    const sampleFeedbacks = [
      {
        id: 1,
        productId: 'PROD-001',
        rating: 5,
        comment: 'Excellent product! Really satisfied with the quality and performance.',
        status: 'PENDING',
        userId: 'user123'
      },
      {
        id: 2,
        productId: 'PROD-002',
        rating: 4,
        comment: 'Good product overall, but could use some improvements in packaging.',
        status: 'APPROVED',
        userId: 'user456'
      },
      {
        id: 3,
        productId: 'PROD-003',
        rating: 2,
        comment: 'Not satisfied with the product. Quality is below expectations.',
        status: 'REJECTED',
        userId: 'user789'
      },
      {
        id: 4,
        productId: 'PROD-001',
        rating: 5,
        comment: 'Amazing product! Fast delivery and great customer service.',
        status: 'PENDING',
        userId: 'user101'
      },
      {
        id: 5,
        productId: 'PROD-004',
        rating: 3,
        comment: 'Average product. Works as expected but nothing special.',
        status: 'APPROVED',
        userId: 'user202'
      }
    ];

    setFeedbacks(sampleFeedbacks);
    setFilteredFeedbacks(sampleFeedbacks);
    
    const stats = sampleFeedbacks.reduce((acc, feedback) => {
      acc.total++;
      acc[feedback.status.toLowerCase()]++;
      return acc;
    }, { total: 0, pending: 0, approved: 0, rejected: 0 });
    
    setStats(stats);
    setSuccess('Sample data loaded successfully!');
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await updateFeedbackStatus(id, status);
      setSuccess(`Feedback ${status.toLowerCase()} successfully!`);
      fetchFeedbacks();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update status');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this feedback?')) return;
    try {
      await deleteFeedback(id);
      setSuccess('Feedback deleted successfully!');
      fetchFeedbacks();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete feedback');
      setTimeout(() => setError(''), 3000);
    }
  };

  // Filter function
  const applyFilters = () => {
    let filtered = [...feedbacks];

    // Status filter
    if (filters.status !== 'ALL') {
      filtered = filtered.filter(feedback => feedback.status === filters.status);
    }

    // Rating filter
    if (filters.rating !== 'ALL') {
      filtered = filtered.filter(feedback => feedback.rating === parseInt(filters.rating));
    }

    // Product ID filter
    if (filters.productId) {
      filtered = filtered.filter(feedback =>
        feedback.productId.toLowerCase().includes(filters.productId.toLowerCase())
      );
    }

    // Search term filter
    if (filters.searchTerm) {
      filtered = filtered.filter(feedback =>
        feedback.comment.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        feedback.productId.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        feedback.userId.toString().includes(filters.searchTerm)
      );
    }

    setFilteredFeedbacks(filtered);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
  };

  const clearFilters = () => {
    setFilters({
      status: 'ALL',
      rating: 'ALL',
      productId: '',
      searchTerm: ''
    });
  };

  useEffect(() => {
    console.log('AdminDashboard component mounted');
    fetchFeedbacks();
  }, []);

  useEffect(() => {
    if (feedbacks.length > 0) {
      applyFilters();
    }
  }, [filters, feedbacks]);
  
  // Fetch data when filters change (for server-side filtering)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (feedbacks.length > 0) { // Only refetch if we have data
        fetchFeedbacks();
      }
    }, 500); // Debounce API calls
    
    return () => clearTimeout(timeoutId);
  }, [filters.status, filters.rating, filters.productId, filters.searchTerm]);

  console.log('AdminDashboard rendering...');
  
  if (activeTab === 'users') {
    return <UserManagement />;
  }

  return (
    <div className="admin-container" style={{ display: 'block', width: '100%', textAlign: 'left', minHeight: '100vh', background: '#f8f9fa' }}>
      <div className="admin-wrapper">
        <div className="admin-header">
          <h1 className="admin-title">Admin Dashboard</h1>
          <p className="admin-subtitle">Manage customer feedback and users</p>
          
          {/* Navigation Tabs */}
          <div className="admin-tabs" style={{ marginTop: '20px' }}>
            <button
              onClick={() => setActiveTab('feedback')}
              className={`tab-button ${activeTab === 'feedback' ? 'active' : ''}`}
              style={{
                padding: '10px 20px',
                marginRight: '10px',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                background: activeTab === 'feedback' ? '#667eea' : '#e2e8f0',
                color: activeTab === 'feedback' ? 'white' : '#64748b',
                fontWeight: '500'
              }}
            >
              📝 Feedback Management
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`tab-button ${activeTab === 'users' ? 'active' : ''}`}
              style={{
                padding: '10px 20px',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                background: activeTab === 'users' ? '#667eea' : '#e2e8f0',
                color: activeTab === 'users' ? 'white' : '#64748b',
                fontWeight: '500'
              }}
            >
              👥 User Management
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card stat-card-1" data-aos="fade-up" data-aos-delay="100">
            <h3 className="stat-number">{stats.total}</h3>
            <p className="stat-label">Total Feedback</p>
          </div>
          <div className="stat-card stat-card-2" data-aos="fade-up" data-aos-delay="200">
            <h3 className="stat-number">{stats.pending}</h3>
            <p className="stat-label">Pending Review</p>
          </div>
          <div className="stat-card stat-card-3" data-aos="fade-up" data-aos-delay="300">
            <h3 className="stat-number">{stats.approved}</h3>
            <p className="stat-label">Approved</p>
          </div>
          <div className="stat-card stat-card-4" data-aos="fade-up" data-aos-delay="400">
            <h3 className="stat-number">{stats.rejected}</h3>
            <p className="stat-label">Rejected</p>
          </div>
        </div>

        {/* Filters Section */}
        <div className="filters-section" data-aos="fade-up" data-aos-delay="500">
          <div className="filters-header">
            <h3 className="filters-title">Filters & Search</h3>
            <button
              onClick={clearFilters}
              className="btn-clear"
            >
              Clear All
            </button>
          </div>

          <div className="filters-grid">
            {/* Search */}
            <div className="filter-group">
              <label className="label">Search</label>
              <input
                type="text"
                placeholder="Search by product, comment, or user..."
                value={filters.searchTerm}
                onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                className="filter-input"
              />
            </div>

            {/* Status Filter */}
            <div className="filter-group">
              <label className="label">Status</label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="filter-select"
              >
                <option value="ALL">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>

            {/* Rating Filter */}
            <div className="filter-group">
              <label className="label">Rating</label>
              <select
                value={filters.rating}
                onChange={(e) => handleFilterChange('rating', e.target.value)}
                className="filter-select"
              >
                <option value="ALL">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
            </div>

            {/* Product ID Filter */}
            <div className="filter-group">
              <label className="label">Product ID</label>
              <input
                type="text"
                placeholder="Filter by product ID..."
                value={filters.productId}
                onChange={(e) => handleFilterChange('productId', e.target.value)}
                className="filter-input"
              />
            </div>
          </div>

          <div className="filters-info">
            Showing {filteredFeedbacks.length} of {feedbacks.length} feedback entries
          </div>
        </div>

        {/* Action Bar */}
        <div className="action-bar">
          <h2 className="action-title">Feedback Management</h2>
          <div style={{ display: 'flex', gap: '10px' }}>
            {feedbacks.length === 0 && (
              <button
                onClick={addSampleData}
                className="btn-sample"
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                📊 Load Sample Data
              </button>
            )}
            <button
              onClick={fetchFeedbacks}
              disabled={loading}
              className={`btn-refresh ${loading ? 'pulse' : ''}`}
            >
              {loading ? 'Loading...' : 'Refresh'}
            </button>
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="error-msg">
            {error}
          </div>
        )}

        {success && (
          <div className="success-msg">
            {success}
          </div>
        )}

        {/* Feedback List */}
        <div className="feedback-list" data-aos="fade-up" data-aos-delay="600">
          {loading ? (
            <LoadingSpinner text="Loading feedbacks..." />
          ) : filteredFeedbacks.length === 0 ? (
            <div className="no-data">
              <div>
                {feedbacks.length === 0 ? 'No feedback submissions found' : 'No feedback matches your filters'}
              </div>
              <div>
                {feedbacks.length === 0 ? 'Customer feedback will appear here once submitted' : 'Try adjusting your search criteria'}
              </div>
              {feedbacks.length === 0 && (
                <button
                  onClick={addSampleData}
                  style={{
                    marginTop: '20px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}
                >
                  📊 Load Sample Data for Testing
                </button>
              )}
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '25px' }}>
              {filteredFeedbacks.map((feedback, index) => (
                <div
                  key={feedback.id}
                  className="feedback-item"
                  style={{ animationDelay: `${0.6 + index * 0.1}s` }}
                >
                  <div className="feedback-grid">
                    <div>
                      <strong className="label">Product ID:</strong>
                      <span className="product-id">{feedback.productId}</span>
                    </div>
                    <div>
                      <strong className="label">Rating:</strong>
                      <span className="rating-stars">
                        {'★'.repeat(feedback.rating)}{'☆'.repeat(5-feedback.rating)}
                      </span>
                      <span className="rating-text">({feedback.rating}/5)</span>
                    </div>
                    <div>
                      <strong className="label">Customer ID:</strong>
                      <span className="customer-id">{feedback.userId}</span>
                    </div>
                    <div>
                      <strong className="label">Status:</strong>
                      <span className={`status-badge status-${feedback.status.toLowerCase()}`}>
                        {feedback.status}
                      </span>
                    </div>
                  </div>

                  <div className="feedback-comment">
                    <div className="comment-box">
                      {feedback.comment}
                    </div>
                  </div>

                  <div className="feedback-actions">
                    {feedback.status === 'PENDING' && (
                      <>
                        <button
                          onClick={() => handleStatusUpdate(feedback.id, 'APPROVED')}
                          className="btn-approve"
                        >
                          ✓ Approve
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(feedback.id, 'REJECTED')}
                          className="btn-reject"
                        >
                          ✗ Reject
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => handleDelete(feedback.id)}
                      className="btn-delete"
                    >
                      🗑 Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
