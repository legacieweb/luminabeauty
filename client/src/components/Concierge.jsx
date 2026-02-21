import React from 'react';

const Concierge = () => {
  return (
    <div className="concierge-page" style={{ paddingTop: '10rem', paddingBottom: '5rem' }}>
      <div className="container" style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 8%' }}>
        <header className="concierge-header" style={{ marginBottom: '4rem', textAlign: 'center' }}>
          <span style={{ textTransform: 'uppercase', letterSpacing: '4px', fontSize: '0.8rem', color: '#888' }}>Personalized Service</span>
          <h1 style={{ fontSize: '3.5rem', fontFamily: 'Playfair Display, serif', marginTop: '1rem' }}>Concierge</h1>
          <p style={{ maxWidth: '600px', margin: '1.5rem auto 0', color: '#666', fontWeight: '300' }}>
            Experience our personalized beauty concierge service for tailored recommendations and expert advice.
          </p>
        </header>

        <div className="concierge-content">
          <div className="concierge-section">
            <h2 style={{ fontSize: '2rem', marginBottom: '2rem', fontFamily: 'Playfair Display, serif' }}>Personalized Beauty Consultations</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
              <div className="consultation">
                <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Skincare Consultation</h3>
                <p style={{ color: '#666' }}>
                  Get personalized skincare recommendations based on your skin type and concerns.
                </p>
              </div>

              <div className="consultation">
                <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Makeup Consultation</h3>
                <p style={{ color: '#666' }}>
                  Learn the latest makeup trends and techniques from our beauty experts.
                </p>
              </div>

              <div className="consultation">
                <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Fragrance Consultation</h3>
                <p style={{ color: '#666' }}>
                  Find your perfect scent with our fragrance profiling service.
                </p>
              </div>
            </div>
          </div>

          <div className="concierge-section" style={{ marginTop: '5rem' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '2rem', fontFamily: 'Playfair Display, serif' }}>How It Works</h2>
            
            <div className="concierge-steps">
              <div className="concierge-step">
                <div style={{ background: 'var(--accent)', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '1rem' }}>1</div>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Schedule Your Consultation</h3>
                <p style={{ color: '#666' }}>
                  Choose a time that works best for you and fill out our consultation form.
                </p>
              </div>

              <div className="concierge-step" style={{ marginTop: '3rem' }}>
                <div style={{ background: 'var(--accent)', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '1rem' }}>2</div>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Meet with Our Expert</h3>
                <p style={{ color: '#666' }}>
                  Have a one-on-one session with our beauty expert to discuss your needs and preferences.
                </p>
              </div>

              <div className="concierge-step" style={{ marginTop: '3rem' }}>
                <div style={{ background: 'var(--accent)', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '1rem' }}>3</div>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Get Personalized Recommendations</h3>
                <p style={{ color: '#666' }}>
                  Receive tailored product recommendations and beauty advice based on your consultation.
                </p>
              </div>
            </div>
          </div>

          <div className="concierge-section" style={{ marginTop: '5rem', textAlign: 'center' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '2rem', fontFamily: 'Playfair Display, serif' }}>Book Your Consultation</h2>
            <p style={{ color: '#666', marginBottom: '2rem' }}>
              Ready to experience our personalized beauty concierge service? Book your consultation today.
            </p>
            <a href="/contact" style={{ background: 'var(--accent)', color: 'white', padding: '1rem 2rem', borderRadius: '5px', textDecoration: 'none', fontWeight: '600', transition: 'background 0.3s ease' }}>
              Schedule Consultation
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Concierge;