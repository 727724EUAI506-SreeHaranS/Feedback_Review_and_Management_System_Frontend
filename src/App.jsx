import { BrowserRouter as Router, Routes, Route, NavLink, Navigate, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import FeedbackForm from './components/FeedbackForm';
import UserFeedbackList from './components/UserFeedbackList';
import AdminDashboard from './components/AdminDashboard';
import Login from './components/Login';
import Register from './components/Register';
import LandingPage from './components/LandingPage';
import Cursor from './components/Cursor';
import AnimatedPage from './components/AnimatedPage';
import Footer from './components/Footer';
import { AnimatePresence } from 'framer-motion';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './App.css';
import './styles/styles.css';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  if (requireAdmin && role !== 'ADMIN') {
    return <Navigate to="/submit-feedback" replace />;
  }
  
  return children;
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [role, setRole] = useState(localStorage.getItem('role'));

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('role');
    setIsLoggedIn(!!token);
    setRole(userRole);
    
    // Initialize AOS
    AOS.init({
      duration: 800,
      easing: 'ease-out',
      once: true,
      offset: 100
    });
  }, []);

  const handleLogin = () => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('role');
    setIsLoggedIn(!!token);
    setRole(userRole);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setIsLoggedIn(false);
    setRole(null);
  };

  return (
    <Router>
      <div className="App">
        <Cursor />
        <nav className="header" style={{ 
          padding: '15px 20px', 
          background: 'rgba(255,255,255,0.15)', 
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(108, 99, 255, 0.1)',
          boxShadow: '0 2px 20px rgba(0,0,0,0.1)'
        }}>
          <ul style={{ 
            listStyle: 'none', 
            display: 'flex', 
            gap: '30px', 
            margin: 0, 
            padding: 0,
            alignItems: 'center'
          }}>
            {!isLoggedIn ? (
              <>
                <li><NavLink to="/" className="btn-ripple" style={({ isActive }) => ({ 
                  color: isActive ? 'var(--primary)' : 'var(--subtext)', 
                  textDecoration: 'none',
                  fontWeight: isActive ? '600' : '500',
                  padding: '8px 16px',
                  borderRadius: '0.75rem',
                  background: isActive ? 'rgba(108, 99, 255, 0.1)' : 'transparent',
                  transition: 'all 0.3s ease'
                })}>Home</NavLink></li>
                <li><NavLink to="/login" className="btn-ripple" style={({ isActive }) => ({ 
                  color: isActive ? 'var(--primary)' : 'var(--subtext)', 
                  textDecoration: 'none',
                  fontWeight: isActive ? '600' : '500',
                  padding: '8px 16px',
                  borderRadius: '0.75rem',
                  background: isActive ? 'rgba(108, 99, 255, 0.1)' : 'transparent',
                  transition: 'all 0.3s ease'
                })}>Login</NavLink></li>
                <li><NavLink to="/register" className="btn-ripple" style={({ isActive }) => ({ 
                  color: isActive ? 'var(--primary)' : 'var(--subtext)', 
                  textDecoration: 'none',
                  fontWeight: isActive ? '600' : '500',
                  padding: '8px 16px',
                  borderRadius: '0.75rem',
                  background: isActive ? 'rgba(108, 99, 255, 0.1)' : 'transparent',
                  transition: 'all 0.3s ease'
                })}>Register</NavLink></li>
              </>
            ) : (
              <>
                {role === 'ADMIN' ? (
                  <>
                    <li><NavLink to="/admin" style={({ isActive }) => ({ color: isActive ? 'blue' : 'black', textDecoration: 'none' })}>Admin Dashboard</NavLink></li>
                    <li><button onClick={handleLogout} style={{ background: 'none', border: 'none', color: 'black', cursor: 'pointer', textDecoration: 'underline' }}>Logout</button></li>
                  </>
                ) : (
                  <>
                    <li><NavLink to="/submit-feedback" style={({ isActive }) => ({ color: isActive ? 'blue' : 'black', textDecoration: 'none' })}>Submit Feedback</NavLink></li>
                    <li><NavLink to="/my-feedback" style={({ isActive }) => ({ color: isActive ? 'blue' : 'black', textDecoration: 'none' })}>My Feedback</NavLink></li>
                    <li><button onClick={handleLogout} style={{ background: 'none', border: 'none', color: 'black', cursor: 'pointer', textDecoration: 'underline' }}>Logout</button></li>
                  </>
                )}
              </>
            )}
          </ul>
        </nav>
        <main className="main-content">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<AnimatedPage><LandingPage /></AnimatedPage>} />
              <Route path="/login" element={<AnimatedPage><Login onLogin={handleLogin} /></AnimatedPage>} />
              <Route path="/register" element={<AnimatedPage><Register /></AnimatedPage>} />
              <Route path="/submit-feedback" element={<ProtectedRoute><AnimatedPage><FeedbackForm /></AnimatedPage></ProtectedRoute>} />
              <Route path="/my-feedback" element={<ProtectedRoute><AnimatedPage><UserFeedbackList /></AnimatedPage></ProtectedRoute>} />
              <Route path="/admin" element={<ProtectedRoute requireAdmin={true}><AnimatedPage><AdminDashboard /></AnimatedPage></ProtectedRoute>} />
              <Route path="*" element={<Navigate to={isLoggedIn ? (role === 'ADMIN' ? "/admin" : "/submit-feedback") : "/"} replace />} />
            </Routes>
          </AnimatePresence>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
