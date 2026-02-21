import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

const Support = () => {
  return (
    <div className="support-page" style={{ paddingTop: '10rem', paddingBottom: '5rem' }}>
      <div className="container" style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 8%' }}>
        <header className="support-header" style={{ marginBottom: '4rem', textAlign: 'center' }}>
          <span style={{ textTransform: 'uppercase', letterSpacing: '4px', fontSize: '0.8rem', color: '#888' }}>Customer Care</span>
          <h1 style={{ fontSize: '3.5rem', fontFamily: 'Playfair Display, serif', marginTop: '1rem' }}>Support</h1>
          <p style={{ maxWidth: '600px', margin: '1.5rem auto 0', color: '#666', fontWeight: '300' }}>
            We're here to help you with any questions or concerns you may have. Our dedicated support team is available to assist you.
          </p>
        </header>

        <div className="support-content" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem' }}>
          <div className="support-card">
            <div className="support-icon" style={{ background: 'var(--secondary)', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem' }}>
              <Mail size={32} color="var(--accent)" />
            </div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Email Support</h3>
            <p style={{ color: '#666', marginBottom: '2rem' }}>
              Send us an email and we'll respond within 24 hours.
            </p>
            <a href="mailto:support@luminabeauty.com" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: '600', transition: 'color 0.3s ease' }}>
              support@luminabeauty.com
            </a>
          </div>

          <div className="support-card">
            <div className="support-icon" style={{ background: 'var(--secondary)', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem' }}>
              <Phone size={32} color="var(--accent)" />
            </div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Phone Support</h3>
            <p style={{ color: '#666', marginBottom: '2rem' }}>
              Call us Monday through Friday, 9am to 6pm.
            </p>
            <a href="tel:+1234567890" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: '600', transition: 'color 0.3s ease' }}>
              +1 (234) 567-890
            </a>
          </div>

          <div className="support-card">
            <div className="support-icon" style={{ background: 'var(--secondary)', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem' }}>
              <MapPin size={32} color="var(--accent)" />
            </div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Visit Us</h3>
            <p style={{ color: '#666', marginBottom: '2rem' }}>
              Come visit our flagship store in New York City.
            </p>
            <address style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: '600', fontStyle: 'normal' }}>
              123 Beauty Avenue<br />
              New York, NY 10001<br />
              United States
            </address>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;