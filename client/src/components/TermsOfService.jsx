import React from 'react';

const TermsOfService = () => {
  return (
    <div className="terms-of-service-page" style={{ paddingTop: '10rem', paddingBottom: '5rem' }}>
      <div className="container" style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 8%' }}>
        <header className="terms-of-service-header" style={{ marginBottom: '4rem', textAlign: 'center' }}>
          <span style={{ textTransform: 'uppercase', letterSpacing: '4px', fontSize: '0.8rem', color: '#888' }}>Legal</span>
          <h1 style={{ fontSize: '3.5rem', fontFamily: 'Playfair Display, serif', marginTop: '1rem' }}>Terms of Service</h1>
          <p style={{ maxWidth: '600px', margin: '1.5rem auto 0', color: '#666', fontWeight: '300' }}>
            These terms of service govern your use of our website and services. Please read them carefully before using our site.
          </p>
        </header>

        <div className="terms-of-service-content">
          <div className="terms-section">
            <h2 style={{ fontSize: '2rem', marginBottom: '2rem', fontFamily: 'Playfair Display, serif' }}>Introduction</h2>
            <p style={{ color: '#666', marginBottom: '2rem' }}>
              Welcome to LUMINA. By accessing or using our website, you agree to comply with and be bound by these terms of service. If you do not agree to these terms, please do not use our website.
            </p>
          </div>

          <div className="terms-section" style={{ marginTop: '3rem' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '2rem', fontFamily: 'Playfair Display, serif' }}>Use of Our Website</h2>
            <p style={{ color: '#666', marginBottom: '2rem' }}>
              You may use our website for personal, non-commercial purposes. You agree not to:
            </p>
            <ul style={{ color: '#666', marginBottom: '2rem', listStylePosition: 'inside' }}>
              <li>Use our website for any illegal or unauthorized purpose</li>
              <li>Violate any laws in your jurisdiction</li>
              <li>Infringe upon our intellectual property rights</li>
              <li>Attempt to hack or disrupt our website</li>
              <li>Collect or harvest any personal information from other users</li>
            </ul>
          </div>

          <div className="terms-section" style={{ marginTop: '3rem' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '2rem', fontFamily: 'Playfair Display, serif' }}>Products and Services</h2>
            <p style={{ color: '#666', marginBottom: '2rem' }}>
              We strive to provide accurate and up-to-date information about our products and services. However, we do not guarantee that all information is error-free. We reserve the right to modify or discontinue any product or service at any time without notice.
            </p>
          </div>

          <div className="terms-section" style={{ marginTop: '3rem' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '2rem', fontFamily: 'Playfair Display, serif' }}>Orders and Payments</h2>
            <p style={{ color: '#666', marginBottom: '2rem' }}>
              When you place an order with us, you agree to provide accurate and complete information. We reserve the right to cancel any order at any time for any reason. Payments are processed through secure payment gateways.
            </p>
          </div>

          <div className="terms-section" style={{ marginTop: '3rem' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '2rem', fontFamily: 'Playfair Display, serif' }}>Returns and Exchanges</h2>
            <p style={{ color: '#666', marginBottom: '2rem' }}>
              Our return and exchange policy is outlined on our Returns page. Please refer to that page for more information.
            </p>
          </div>

          <div className="terms-section" style={{ marginTop: '3rem' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '2rem', fontFamily: 'Playfair Display, serif' }}>Intellectual Property</h2>
            <p style={{ color: '#666', marginBottom: '2rem' }}>
              All content on our website, including but not limited to text, images, logos, and graphics, is the property of LUMINA and is protected by intellectual property laws. You may not use any of our content without our prior written consent.
            </p>
          </div>

          <div className="terms-section" style={{ marginTop: '3rem' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '2rem', fontFamily: 'Playfair Display, serif' }}>Disclaimer of Warranty</h2>
            <p style={{ color: '#666', marginBottom: '2rem' }}>
              Our website and services are provided "as is" without any warranty of any kind, express or implied. We do not warrant that our website will be error-free, secure, or available at all times.
            </p>
          </div>

          <div className="terms-section" style={{ marginTop: '3rem' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '2rem', fontFamily: 'Playfair Display, serif' }}>Limitation of Liability</h2>
            <p style={{ color: '#666', marginBottom: '2rem' }}>
              LUMINA shall not be liable for any direct, indirect, incidental, special, or consequential damages arising out of or in connection with your use of our website or services.
            </p>
          </div>

          <div className="terms-section" style={{ marginTop: '3rem' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '2rem', fontFamily: 'Playfair Display, serif' }}>Changes to These Terms</h2>
            <p style={{ color: '#666', marginBottom: '2rem' }}>
              We may update these terms of service from time to time. We will notify you of any changes by posting the updated terms on our website.
            </p>
          </div>

          <div className="terms-section" style={{ marginTop: '3rem' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '2rem', fontFamily: 'Playfair Display, serif' }}>Governing Law</h2>
            <p style={{ color: '#666', marginBottom: '2rem' }}>
              These terms of service shall be governed by and construed in accordance with the laws of the State of New York. Any disputes arising out of these terms shall be resolved in the courts of New York.
            </p>
          </div>

          <div className="terms-section" style={{ marginTop: '3rem' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '2rem', fontFamily: 'Playfair Display, serif' }}>Contact Us</h2>
            <p style={{ color: '#666', marginBottom: '2rem' }}>
              If you have any questions about these terms of service, please contact us at:
            </p>
            <p style={{ color: '#666', marginBottom: '2rem' }}>
              Email: legal@luminabeauty.com<br />
              Phone: +1 (234) 567-890<br />
              Address: 123 Beauty Avenue, New York, NY 10001
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;