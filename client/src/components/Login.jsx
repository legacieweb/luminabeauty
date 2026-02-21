import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../Auth.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const res = await axios.post('https://luminabeauty.onrender.com/api/auth/login', formData);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      
      if (res.data.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
      window.location.reload();
    } catch (err) {
      setError(err.response?.data?.message || 'Identity verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-visual">
        <img 
          src="https://img.freepik.com/premium-photo/hair-care-portrait-happy-model-studio-with-keratin-treatment-shampoo-cosmetics-wind-white-background-salon-beauty-girl-with-smile-natural-glow-shine-healthy-texture_590464-432510.jpg" 
          alt="Lumina Luxury Skincare" 
        />
        <div className="auth-visual-overlay"></div>
      </div>

      <div className="auth-content">
        <header className="auth-header">
          <Link to="/" className="logo">LUMINA</Link>
          <h1>Welcome Back</h1>
          <p>Sign in to continue your beauty ritual.</p>
        </header>

        {error && <div className="error-toast">{error}</div>}

        <div className="immersive-form">
          <div className="immersive-input-group">
            <label className="immersive-input-label">Identity</label>
            <input 
              type="email" 
              name="email" 
              className="immersive-input"
              value={formData.email} 
              onChange={handleChange} 
              placeholder="Email Address"
              required 
            />
          </div>

          <div className="immersive-input-group">
            <label className="immersive-input-label">Access Key</label>
            <input 
              type="password" 
              name="password" 
              className="immersive-input"
              value={formData.password} 
              onChange={handleChange} 
              placeholder="Password"
              required 
            />
          </div>

          <div className="auth-footer">
            <button 
              className="auth-primary-btn" 
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? 'Verifying...' : 'Authenticate'}
            </button>

            <div className="auth-secondary-actions">
              <Link to="/signup">Create Account</Link>
              <Link to="/forgot-password">Forgot Password?</Link>
            </div>

            <div className="social-login-minimal">
              <span style={{ color: '#ccc', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Or via</span>
              <button onClick={() => {}} className="social-link" style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>Google</button>
              <button onClick={() => {}} className="social-link" style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>Apple</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
