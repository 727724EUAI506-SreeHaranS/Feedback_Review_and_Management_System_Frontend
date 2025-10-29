// Safe environment variable access with fallback
let apiBaseUrl;
try {
  apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081/api';
} catch (error) {
  console.warn('Failed to access environment variables:', error);
  apiBaseUrl = 'http://localhost:8081/api';
}

export const API_BASE_URL = apiBaseUrl;
export const FEEDBACK_STATUSES = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED'
};
