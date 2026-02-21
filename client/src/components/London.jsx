import React from 'react';
import { MapPin } from 'lucide-react';

const London = () => {
  return (
    <div className="store-page" style={{ paddingTop: '10rem', paddingBottom: '5rem' }}>
      <div className="container" style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 8%' }}>
        <header className="store-header" style={{ marginBottom: '4rem', textAlign: 'center' }}>
          <span style={{ textTransform: 'uppercase', letterSpacing: '4px', fontSize: '0.8rem', color: '#888' }}>London</span>
          <h1 style={{ fontSize: '3.5rem', fontFamily: 'Playfair Display, serif', marginTop: '1rem' }}>LUMINA London</h1>
          <p style={{ maxWidth: '600px', margin: '1.5rem auto 0', color: '#666', fontWeight: '300' }}>
            Experience LUMINA beauty at our sophisticated store in the heart of London.
          </p>
        </header>

        <div className="store-content">
          <div className="store-info" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem' }}>
            <div className="store-details">
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
                <MapPin size={24} color="var(--accent)" style={{ marginRight: '1rem' }} />
                <h2 style={{ fontSize: '2rem', fontFamily: 'Playfair Display, serif' }}>Store Information</h2>
              </div>
              <div className="store-detail">
                <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Address</h3>
                <p style={{ color: '#666', marginBottom: '2rem' }}>789 Beauty Street, London WC1A 1AA, UK</p>
              </div>
              <div className="store-detail">
                <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Phone</h3>
                <p style={{ color: '#666', marginBottom: '2rem' }}>+44 (0)20 1234 5678</p>
              </div>
              <div className="store-detail">
                <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Hours</h3>
                <p style={{ color: '#666', marginBottom: '2rem' }}>Mon-Sat: 9am-8pm, Sun: 11am-6pm</p>
              </div>
            </div>

            <div className="store-map" style={{ background: '#f5f5f5', height: '400px', borderRadius: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <p style={{ color: '#666' }}>Map placeholder</p>
            </div>
          </div>

          <div className="store-features" style={{ marginTop: '5rem' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '2rem', fontFamily: 'Playfair Display, serif' }}>Store Features</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
              <div className="feature">
                <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Personalized Beauty Consultations</h3>
                <p style={{ color: '#666' }}>
                  Get personalized beauty recommendations from our expert staff.
                </p>
              </div>
              <div className="feature">
                <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Product Testing</h3>
                <p style={{ color: '#666' }}>
                  Try before you buy with our extensive product testing station.
                </p>
              </div>
              <div className="feature">
                <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Exclusive Events</h3>
                <p style={{ color: '#666' }}>
                  Attend exclusive beauty events and workshops.
                </p>
              </div>
            </div>
          </div>

          <div className="store-visit" style={{ marginTop: '5rem', textAlign: 'center' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '2rem', fontFamily: 'Playfair Display, serif' }}>Plan Your Visit</h2>
            <p style={{ color: '#666', marginBottom: '2rem' }}>
              We look forward to welcoming you to our London store.
            </p>
            <a href="/contact" style={{ background: 'var(--accent)', color: 'white', padding: '1rem 2rem', borderRadius: '5px', textDecoration: 'none', fontWeight: '600', transition: 'background 0.3s ease' }}>
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default London;