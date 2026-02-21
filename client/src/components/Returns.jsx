import React from 'react';

const Returns = () => {
  return (
    <div className="returns-page" style={{ paddingTop: '10rem', paddingBottom: '5rem' }}>
      <div className="container" style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 8%' }}>
        <header className="returns-header" style={{ marginBottom: '4rem', textAlign: 'center' }}>
          <span style={{ textTransform: 'uppercase', letterSpacing: '4px', fontSize: '0.8rem', color: '#888' }}>Returns & Exchanges</span>
          <h1 style={{ fontSize: '3.5rem', fontFamily: 'Playfair Display, serif', marginTop: '1rem' }}>Returns</h1>
          <p style={{ maxWidth: '600px', margin: '1.5rem auto 0', color: '#666', fontWeight: '300' }}>
            We want you to be completely satisfied with your purchase. If you're not happy, we offer easy returns and exchanges.
          </p>
        </header>

        <div className="returns-content">
          <div className="returns-section">
            <h2 style={{ fontSize: '2rem', marginBottom: '2rem', fontFamily: 'Playfair Display, serif' }}>Return Policy</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
              <div className="return-info">
                <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>30-Day Return Window</h3>
                <p style={{ color: '#666' }}>
                  You have 30 days from the date of delivery to return your item.
                </p>
              </div>

              <div className="return-info">
                <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Free Returns</h3>
                <p style={{ color: '#666' }}>
                  We offer free returns on all orders.
                </p>
              </div>

              <div className="return-info">
                <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Condition of Items</h3>
                <p style={{ color: '#666' }}>
                  Items must be returned in their original condition, unused, and in their original packaging.
                </p>
              </div>

              <div className="return-info">
                <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Refund Process</h3>
                <p style={{ color: '#666' }}>
                  Refunds are processed within 3-5 business days of receiving your return.
                </p>
              </div>
            </div>
          </div>

          <div className="returns-section" style={{ marginTop: '5rem' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '2rem', fontFamily: 'Playfair Display, serif' }}>How to Return</h2>
            
            <div className="return-steps">
              <div className="return-step">
                <div style={{ background: 'var(--accent)', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '1rem' }}>1</div>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Package Your Item</h3>
                <p style={{ color: '#666' }}>
                  Pack the item securely in its original packaging.
                </p>
              </div>

              <div className="return-step" style={{ marginTop: '3rem' }}>
                <div style={{ background: 'var(--accent)', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '1rem' }}>2</div>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Print Return Label</h3>
                <p style={{ color: '#666' }}>
                  Download and print the pre-paid return label from your order confirmation.
                </p>
              </div>

              <div className="return-step" style={{ marginTop: '3rem' }}>
                <div style={{ background: 'var(--accent)', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '1rem' }}>3</div>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Ship Your Return</h3>
                <p style={{ color: '#666' }}>
                  Drop off your package at any authorized shipping location.
                </p>
              </div>

              <div className="return-step" style={{ marginTop: '3rem' }}>
                <div style={{ background: 'var(--accent)', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '1rem' }}>4</div>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Track Your Return</h3>
                <p style={{ color: '#666' }}>
                  Use the tracking number to monitor the status of your return.
                </p>
              </div>
            </div>
          </div>

          <div className="returns-section" style={{ marginTop: '5rem', textAlign: 'center' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '2rem', fontFamily: 'Playfair Display, serif' }}>Need Help?</h2>
            <p style={{ color: '#666', marginBottom: '2rem' }}>
              If you have any questions about our return policy, please don't hesitate to contact us.
            </p>
            <a href="/support" style={{ background: 'var(--accent)', color: 'white', padding: '1rem 2rem', borderRadius: '5px', textDecoration: 'none', fontWeight: '600', transition: 'background 0.3s ease' }}>
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Returns;