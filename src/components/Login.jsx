import React, { useState } from 'react';
import { login } from '../utils/api';
import { useNavigate } from 'react-router-dom';

const Login = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(credentials);
      onLogin();

      const role = localStorage.getItem('role');
      if (role === 'ADMIN') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/submit-feedback', { replace: true });
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || err.message || 'Login failed. Please check if the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card card-login">
        <div className="title-section">
          <h2 className="title">Welcome Back</h2>
          <p className="subtitle">Sign in to your account</p>
        </div>

        {error && (
          <div className="error-msg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="label">Username</label>
            <input
              type="text"
              name="username"
              value={credentials.username}
              onChange={handleChange}
              disabled={loading}
              className="input-field"
            />
          </div>

          <div className="form-group">
            <label className="label">Password</label>
            <input
              type="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              disabled={loading}
              className="input-field"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`btn-primary ${loading ? 'pulse' : ''}`}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="info-box">
          <div className="info-strong">For Example:</div>
          <div className="info-text">
            <strong>Regular User:</strong> testuser / password123<br/>
            <strong>Admin:</strong> admin / admin123<br/>
            <em>(Register first if accounts don't exist)</em>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;