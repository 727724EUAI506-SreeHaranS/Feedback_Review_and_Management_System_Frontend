import React, { useState } from 'react';
import { register } from '../utils/api';
import { useNavigate } from 'react-router-dom';

const Register = ({ onLogin }) => {
  const [userData, setUserData] = useState({
    username: '',
    password: '',
    email: '',
    role: 'USER'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(userData);
      setError('Registration successful! Please login with your credentials.');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data?.message || err.message || 'Registration failed. Please check if the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card card-register">
        <div className="title-section">
          <h2 className="title">Create Account</h2>
          <p className="subtitle">Join our feedback community</p>
        </div>

        {error && (
          <div className={error.includes('successful') ? 'success-msg' : 'error-msg'}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="label">Username</label>
            <input
              type="text"
              name="username"
              value={userData.username}
              onChange={handleChange}
              disabled={loading}
              required
              className="input-field"
            />
          </div>

          <div className="form-group">
            <label className="label">Email</label>
            <input
              type="email"
              name="email"
              value={userData.email}
              onChange={handleChange}
              disabled={loading}
              required
              className="input-field"
            />
          </div>

          <div className="form-group">
            <label className="label">Password</label>
            <input
              type="password"
              name="password"
              value={userData.password}
              onChange={handleChange}
              disabled={loading}
              required
              className="input-field"
            />
          </div>

          <div className="form-group">
            <label className="label">Account Type</label>
            <select
              name="role"
              value={userData.role}
              onChange={handleChange}
              disabled={loading}
              className="select-field"
            >
              <option value="USER">User</option>
              <option value="ADMIN">Administrator</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`btn-primary ${loading ? 'pulse' : ''}`}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="info-box" style={{ textAlign: 'center', color: '#666' }}>
          After registration, you'll be redirected to login with your new credentials.
        </div>
      </div>
    </div>
  );
};

export default Register;