import React from 'react';

const Shipping = () => {
  return (
    <div className="shipping-page" style={{ paddingTop: '10rem', paddingBottom: '5rem' }}>
      <div className="container" style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 8%' }}>
        <header className="shipping-header" style={{ marginBottom: '4rem', textAlign: 'center' }}>
          <span style={{ textTransform: 'uppercase', letterSpacing: '4px', fontSize: '0.8rem', color: '#888' }}>Delivery</span>
          <h1 style={{ fontSize: '3.5rem', fontFamily: 'Playfair Display, serif', marginTop: '1rem' }}>Shipping</h1>
          <p style={{ maxWidth: '600px', margin: '1.5rem auto 0', color: '#666', fontWeight: '300' }}>
            Fast and reliable shipping to ensure your products arrive in perfect condition.
          </p>
        </header>

        <div className="shipping-content">
          <div className="shipping-section">
            <h2 style={{ fontSize: '2rem', marginBottom: '2rem', fontFamily: 'Playfair Display, serif' }}>Shipping Methods</h2>
            
            <div className="shipping-method">
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', display: 'flex', alignItems: 'center' }}>
                <span style={{ background: 'var(--accent)', width: '30px', height: '30px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', marginRight: '1rem', fontSize: '0.9rem' }}>1</span>
                Standard Shipping
              </h3>
              <p style={{ color: '#666', marginBottom: '1rem' }}>
                Delivery in 5-7 business days.
              </p>
              <p style={{ color: 'var(--accent)', fontWeight: '600' }}>$5.99</p>
            </div>

            <div className="shipping-method" style={{ marginTop: '3rem' }}>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', display: 'flex', alignItems: 'center' }}>
                <span style={{ background: 'var(--accent)', width: '30px', height: '30px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', marginRight: '1rem', fontSize: '0.9rem' }}>2</span>
                Express Shipping
              </h3>
              <p style={{ color: '#666', marginBottom: '1rem' }}>
                Delivery in 2-3 business days.
              </p>
              <p style={{ color: 'var(--accent)', fontWeight: '600' }}>$12.99</p>
            </div>

            <div className="shipping-method" style={{ marginTop: '3rem' }}>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', display: 'flex', alignItems: 'center' }}>
                <span style={{ background: 'var(--accent)', width: '30px', height: '30px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', marginRight: '1rem', fontSize: '0.9rem' }}>3</span>
                Next Day Shipping
              </h3>
              <p style={{ color: '#666', marginBottom: '1rem' }}>
                Delivery next business day (order by 2pm).
              </p>
              <p style={{ color: 'var(--accent)', fontWeight: '600' }}>$24.99</p>
            </div>
          </div>

          <div className="shipping-section" style={{ marginTop: '5rem' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '2rem', fontFamily: 'Playfair Display, serif' }}>Shipping Information</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
              <div className="shipping-info">
                <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Free Shipping</h3>
                <p style={{ color: '#666' }}>
                  Enjoy free standard shipping on orders over $100.
                </p>
              </div>

              <div className="shipping-info">
                <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>International Shipping</h3>
                <p style={{ color: '#666' }}>
                  We offer international shipping to select countries. Rates vary by destination.
                </p>
              </div>

              <div className="shipping-info">
                <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Tracking</h3>
                <p style={{ color: '#666' }}>
                  You will receive a tracking number via email once your order ships.
                </p>
              </div>

              <div className="shipping-info">
                <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Processing Time</h3>
                <p style={{ color: '#666' }}>
                  Orders are processed within 1-2 business days.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shipping;