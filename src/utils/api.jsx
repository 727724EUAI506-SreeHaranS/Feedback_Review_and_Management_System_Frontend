import axios from 'axios';
import { API_BASE_URL } from './constants';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add Authorization header
api.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    } catch (error) {
      console.error('Request interceptor error:', error);
      return config;
    }
  },
  (error) => Promise.reject(error)
);

// Response interceptor for global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 - token expired or invalid
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      window.location.href = '/login';
    }
    
    // Enhanced error sanitization to prevent XSS
    let sanitizedMessage = 'An error occurred';
    if (error.response?.data?.message && typeof error.response.data.message === 'string') {
      // Remove HTML tags and limit message length
      sanitizedMessage = error.response.data.message
        .replace(/<[^>]*>/g, '')
        .replace(/[<>"'&]/g, '')
        .substring(0, 200);
    } else if (typeof error.message === 'string') {
      sanitizedMessage = error.message
        .replace(/<[^>]*>/g, '')
        .replace(/[<>"'&]/g, '')
        .substring(0, 200);
    }
    
    const sanitizedError = {
      ...error,
      message: sanitizedMessage
    };
    
    // Safe logging without exposing sensitive data
    console.error('API Error:', {
      status: error.response?.status,
      message: sanitizedMessage,
      endpoint: error.config?.url?.replace(/\/\d+/g, '/:id') // Hide IDs in logs
    });
    
    return Promise.reject(sanitizedError);
  }
);

// Authentication APIs
export const login = (credentials) => {
  if (!credentials || !credentials.username || !credentials.password) {
    return Promise.reject(new Error('Invalid credentials'));
  }
  return api.post('/auth/login', credentials).then((response) => {
    try {
      const { token, role } = response.data;
      if (token && role) {
        localStorage.setItem('token', token);
        localStorage.setItem('role', role);
      }
      return response;
    } catch (error) {
      console.error('Login response processing error:', error);
      throw new Error('Login processing failed');
    }
  });
};

export const register = (userData) => {
  if (!userData || !userData.username || !userData.password || !userData.email) {
    return Promise.reject(new Error('Invalid user data'));
  }
  return api.post('/auth/register', userData);
};

export const registerAdmin = (userData) => {
  if (!userData || !userData.username || !userData.password || !userData.email) {
    return Promise.reject(new Error('Invalid admin data'));
  }
  return api.post('/auth/register-admin', userData);
};

// User Feedback APIs
export const submitFeedback = (feedback) => {
  if (!feedback || !feedback.productId || !feedback.rating || !feedback.comment) {
    return Promise.reject(new Error('Invalid feedback data'));
  }
  return api.post('/feedback', feedback);
};
export const getUserFeedback = () => api.get('/feedback/user');

// Admin Dashboard APIs
export const getDashboardStats = () => api.get('/admin/dashboard');

// Admin User Management APIs
export const getUsers = (params = {}) => {
  try {
    const { page = 0, size = 20, ...otherParams } = params;
    // Validate pagination parameters
    const validPage = Math.max(0, parseInt(page) || 0);
    const validSize = Math.min(100, Math.max(1, parseInt(size) || 20));
    return api.get('/admin/users', { params: { page: validPage, size: validSize, ...otherParams } });
  } catch (error) {
    return Promise.reject(new Error('Invalid parameters for getUsers'));
  }
};
export const getUserStats = () => api.get('/admin/users/stats');
export const updateUserRole = (id, role) => {
  // Validate inputs to prevent SSRF
  if (!id || typeof id !== 'string' && typeof id !== 'number') {
    return Promise.reject(new Error('Invalid user ID'));
  }
  if (!role || typeof role !== 'string') {
    return Promise.reject(new Error('Invalid role'));
  }
  const sanitizedId = String(id).replace(/[^a-zA-Z0-9-]/g, '');
  return api.put(`/admin/users/${sanitizedId}/role`, { role });
};
export const deleteUser = (id) => {
  // Validate input to prevent SSRF
  if (!id || typeof id !== 'string' && typeof id !== 'number') {
    return Promise.reject(new Error('Invalid user ID'));
  }
  const sanitizedId = String(id).replace(/[^a-zA-Z0-9-]/g, '');
  return api.delete(`/admin/users/${sanitizedId}`);
};

// Admin Feedback Management APIs
export const getAllFeedback = (params = {}) => {
  try {
    const { status, rating, productId, search, page = 0, size = 50 } = params;
    // Validate and sanitize parameters
    const validPage = Math.max(0, parseInt(page) || 0);
    const validSize = Math.min(100, Math.max(1, parseInt(size) || 50));
    const sanitizedSearch = search ? String(search).substring(0, 100) : undefined;
    
    return api.get('/admin/feedback', { 
      params: { status, rating, productId, search: sanitizedSearch, page: validPage, size: validSize } 
    });
  } catch (error) {
    return Promise.reject(new Error('Invalid parameters for getAllFeedback'));
  }
};
export const getFeedbackProducts = () => api.get('/admin/feedback/products');
export const getFeedbackStats = () => api.get('/admin/feedback/stats');
export const updateFeedbackStatus = (id, status) => {
  // Validate inputs to prevent SSRF
  if (!id || typeof id !== 'string' && typeof id !== 'number') {
    return Promise.reject(new Error('Invalid feedback ID'));
  }
  if (!status || typeof status !== 'string') {
    return Promise.reject(new Error('Invalid status'));
  }
  const sanitizedId = String(id).replace(/[^a-zA-Z0-9-]/g, '');
  return api.put(`/admin/feedback/${sanitizedId}/status`, { status });
};
export const deleteFeedback = (id) => {
  // Validate input to prevent SSRF
  if (!id || typeof id !== 'string' && typeof id !== 'number') {
    return Promise.reject(new Error('Invalid feedback ID'));
  }
  const sanitizedId = String(id).replace(/[^a-zA-Z0-9-]/g, '');
  return api.delete(`/admin/feedback/${sanitizedId}`);
};

// Legacy functions for backward compatibility
export const getAdminFeedback = getAllFeedback;

export default api;
