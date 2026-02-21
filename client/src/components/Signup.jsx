import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../Auth.css';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
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
    
    if (formData.password !== formData.confirmPassword) {
      setError('Key validation failed: Passwords do not match');
      setIsLoading(false);
      return;
    }
    
    try {
      const res = await axios.post('https://luminabeauty.onrender.com/api/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/');
      window.location.reload();
    } catch (err) {
      setError(err.response?.data?.message || 'Identity registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-visual">
        <img 
          src="https://img.freepik.com/premium-photo/loving-her-natural-beautiful-self-studio-portrait-attractive-young-woman-posing-with-her-arms-across-her-chest-against-grey-background_590464-45340.jpg" 
          alt="Lumina Artisan Beauty" 
        />
        <div className="auth-visual-overlay"></div>
      </div>

      <div className="auth-content">
        <header className="auth-header">
          <Link to="/" className="logo">LUMINA</Link>
          <h1>Create Identity</h1>
          <p>Join our curated beauty community.</p>
        </header>

        {error && <div className="error-toast">{error}</div>}

        <div className="immersive-form">
          <div className="immersive-input-group">
            <label className="immersive-input-label">Full Name</label>
            <input 
              type="text" 
              name="name" 
              className="immersive-input"
              value={formData.name} 
              onChange={handleChange} 
              placeholder="Your Name"
              required 
            />
          </div>

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
            <label className="immersive-input-label">Create Key</label>
            <input 
              type="password" 
              name="password" 
              className="immersive-input"
              value={formData.password} 
              onChange={handleChange} 
              placeholder="Min. 8 characters"
              required 
            />
          </div>

          <div className="immersive-input-group">
            <label className="immersive-input-label">Confirm Key</label>
            <input 
              type="password" 
              name="confirmPassword" 
              className="immersive-input"
              value={formData.confirmPassword} 
              onChange={handleChange} 
              placeholder="Confirm Password"
              required 
            />
          </div>

          <div className="auth-footer">
            <button 
              className="auth-primary-btn" 
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? 'Registering...' : 'Initialize Account'}
            </button>

            <div className="auth-secondary-actions">
              <Link to="/login">Already Registered? Sign In</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
