import React, { useState, useEffect } from 'react';
import { getUsers, getUserStats, updateUserRole, deleteUser } from '../utils/api';
import LoadingSpinner from './LoadingSpinner';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    adminCount: 0,
    userCount: 0
  });
  const [pagination, setPagination] = useState({
    page: 0,
    size: 20,
    totalPages: 0,
    totalElements: 0
  });

  const fetchUsers = async (page = 0) => {
    setLoading(true);
    setError('');
    try {
      // Validate page parameter
      const validPage = Math.max(0, parseInt(page) || 0);
      
      const [usersResponse, statsResponse] = await Promise.all([
        getUsers({ page: validPage, size: pagination.size }),
        getUserStats().catch((error) => {
          console.warn('Failed to fetch user stats:', error);
          return { data: null };
        })
      ]);

      if (!usersResponse || !usersResponse.data) {
        throw new Error('Invalid response from server');
      }

      let userData = usersResponse.data;
      if (userData.content && Array.isArray(userData.content)) {
        setUsers(userData.content);
        setPagination(prev => ({
          ...prev,
          page: userData.number || 0,
          totalPages: userData.totalPages || 0,
          totalElements: userData.totalElements || 0
        }));
      } else if (Array.isArray(userData)) {
        setUsers(userData);
      } else {
        setUsers([]);
        console.warn('Unexpected user data format:', userData);
      }

      if (statsResponse && statsResponse.data) {
        setStats({
          total: statsResponse.data.total || 0,
          adminCount: statsResponse.data.adminCount || 0,
          userCount: statsResponse.data.userCount || 0
        });
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch users';
      setError(errorMessage);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleUpdate = async (userId, newRole) => {
    if (!userId || !newRole) {
      setError('Invalid user ID or role');
      setTimeout(() => setError(''), 3000);
      return;
    }
    
    try {
      await updateUserRole(userId, newRole);
      setSuccess(`User role updated to ${newRole} successfully!`);
      await fetchUsers(pagination.page);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error updating user role:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to update user role';
      setError(errorMessage);
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!userId) {
      setError('Invalid user ID');
      setTimeout(() => setError(''), 3000);
      return;
    }
    
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    
    try {
      await deleteUser(userId);
      setSuccess('User deleted successfully!');
      await fetchUsers(pagination.page);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error deleting user:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to delete user';
      setError(errorMessage);
      setTimeout(() => setError(''), 3000);
    }
  };

  useEffect(() => {
    try {
      fetchUsers();
    } catch (error) {
      console.error('Error in useEffect:', error);
      setError('Failed to initialize user management');
    }
  }, []);

  return (
    <div className="admin-container">
      <div className="admin-wrapper">
        <div className="admin-header">
          <h1 className="admin-title">User Management</h1>
          <p className="admin-subtitle">Manage user accounts and roles</p>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card stat-card-1">
            <h3 className="stat-number">{stats.total}</h3>
            <p className="stat-label">Total Users</p>
          </div>
          <div className="stat-card stat-card-2">
            <h3 className="stat-number">{stats.adminCount}</h3>
            <p className="stat-label">Administrators</p>
          </div>
          <div className="stat-card stat-card-3">
            <h3 className="stat-number">{stats.userCount}</h3>
            <p className="stat-label">Regular Users</p>
          </div>
        </div>

        {/* Messages */}
        {error && <div className="error-msg">{error}</div>}
        {success && <div className="success-msg">{success}</div>}

        {/* Users List */}
        <div className="feedback-list">
          {loading ? (
            <LoadingSpinner text="Loading users..." />
          ) : users.length === 0 ? (
            <div className="no-data">
              <div>No users found</div>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '20px' }}>
              {users.map((user) => (
                <div key={user.id} className="feedback-item">
                  <div className="feedback-grid">
                    <div>
                      <strong className="label">User ID:</strong>
                      <span>{user.id}</span>
                    </div>
                    <div>
                      <strong className="label">Username:</strong>
                      <span>{user.username}</span>
                    </div>
                    <div>
                      <strong className="label">Email:</strong>
                      <span>{user.email}</span>
                    </div>
                    <div>
                      <strong className="label">Role:</strong>
                      <span className={`status-badge status-${user.role.toLowerCase()}`}>
                        {user.role}
                      </span>
                    </div>
                  </div>

                  <div className="feedback-actions">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleUpdate(user.id, e.target.value)}
                      className="filter-select"
                      style={{ marginRight: '10px' }}
                    >
                      <option value="USER">USER</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                    <button
                      onClick={() => handleDeleteUser(user.id)}
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

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="pagination" style={{ marginTop: '20px', textAlign: 'center' }}>
            <button
              onClick={() => fetchUsers(pagination.page - 1)}
              disabled={pagination.page === 0}
              className="btn-refresh"
            >
              Previous
            </button>
            <span style={{ margin: '0 15px' }}>
              Page {pagination.page + 1} of {pagination.totalPages}
            </span>
            <button
              onClick={() => fetchUsers(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages - 1}
              className="btn-refresh"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;