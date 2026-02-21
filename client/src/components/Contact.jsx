import React, { useState } from 'react';
import axios from 'axios';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('');

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Sending...');
    try {
      await axios.post('https://luminabeauty.onrender.com/api/contact', formData);
      setStatus('Message sent successfully!');
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      setStatus('Failed to send message.');
    }
  };

  return (
    <section id="contact" className="section contact-luxury">
      <div className="contact-wrapper">
        <div className="contact-visual">
          <div className="visual-content">
            <span className="subtitle">Concierge</span>
            <h2>We're Here for Your Skin Journey</h2>
            <p>Our experts are available for personalized consultations and assistance with your Lumina ritual.</p>
            
            <div className="contact-details">
              <div className="detail-item">
                <div className="icon-box"><MapPin size={20} /></div>
                <div>
                  <h4>Flagship Boutique</h4>
                  <p>742 Fifth Avenue, New York</p>
                </div>
              </div>
              <div className="detail-item">
                <div className="icon-box"><Phone size={20} /></div>
                <div>
                  <h4>Phone Assistance</h4>
                  <p>+1 (212) 555-0198</p>
                </div>
              </div>
              <div className="detail-item">
                <div className="icon-box"><Mail size={20} /></div>
                <div>
                  <h4>Email Concierge</h4>
                  <p>concierge@luminabeauty.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="contact-form-container">
          <form onSubmit={handleSubmit} className="luxury-form">
            <div className="form-title">
              <h3>Send a Message</h3>
              <p>Typically responds within 2 hours</p>
            </div>
            <div className="form-group">
              <label>Full Name</label>
              <input 
                type="text" 
                name="name" 
                value={formData.name} 
                onChange={handleInputChange} 
                placeholder="Your full name" 
                required 
              />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input 
                type="email" 
                name="email" 
                value={formData.email} 
                onChange={handleInputChange} 
                placeholder="your.email@example.com" 
                required 
              />
            </div>
            <div className="form-group">
              <label>How can we assist you?</label>
              <textarea 
                name="message" 
                value={formData.message} 
                onChange={handleInputChange} 
                placeholder="How can we help you today?" 
                required
              ></textarea>
            </div>
            <button type="submit" className="btn btn-primary btn-send">
              Send Message <Send size={18} style={{ marginLeft: '10px' }} />
            </button>
            {status && <p className={`status-text ${status.includes('successfully') ? 'success' : ''}`}>{status}</p>}
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
