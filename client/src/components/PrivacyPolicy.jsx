import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="privacy-policy-page" style={{ paddingTop: '10rem', paddingBottom: '5rem' }}>
      <div className="container" style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 8%' }}>
        <header className="privacy-policy-header" style={{ marginBottom: '4rem', textAlign: 'center' }}>
          <span style={{ textTransform: 'uppercase', letterSpacing: '4px', fontSize: '0.8rem', color: '#888' }}>Legal</span>
          <h1 style={{ fontSize: '3.5rem', fontFamily: 'Playfair Display, serif', marginTop: '1rem' }}>Privacy Policy</h1>
          <p style={{ maxWidth: '600px', margin: '1.5rem auto 0', color: '#666', fontWeight: '300' }}>
            Your privacy is important to us. This privacy policy explains how we collect, use, and protect your personal information.
          </p>
        </header>

        <div className="privacy-policy-content">
          <div className="policy-section">
            <h2 style={{ fontSize: '2rem', marginBottom: '2rem', fontFamily: 'Playfair Display, serif' }}>Introduction</h2>
            <p style={{ color: '#666', marginBottom: '2rem' }}>
              Welcome to LUMINA. We are committed to protecting your privacy and ensuring that your personal information is handled in a secure and responsible manner. This privacy policy outlines how we collect, use, and share your personal information when you use our website or services.
            </p>
          </div>

          <div className="policy-section" style={{ marginTop: '3rem' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '2rem', fontFamily: 'Playfair Display, serif' }}>Information We Collect</h2>
            <p style={{ color: '#666', marginBottom: '2rem' }}>
              We collect the following types of personal information:
            </p>
            <ul style={{ color: '#666', marginBottom: '2rem', listStylePosition: 'inside' }}>
              <li>Name and contact information (email, phone number, address)</li>
              <li>Payment information</li>
              <li>Order history</li>
              <li>Browsing and purchase behavior</li>
              <li>Preferences and interests</li>
              <li>Demographic information</li>
            </ul>
          </div>

          <div className="policy-section" style={{ marginTop: '3rem' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '2rem', fontFamily: 'Playfair Display, serif' }}>How We Use Your Information</h2>
            <p style={{ color: '#666', marginBottom: '2rem' }}>
              We use your personal information for the following purposes:
            </p>
            <ul style={{ color: '#666', marginBottom: '2rem', listStylePosition: 'inside' }}>
              <li>To process and fulfill your orders</li>
              <li>To communicate with you about your orders and our products</li>
              <li>To personalize your shopping experience</li>
              <li>To send you marketing communications</li>
              <li>To improve our products and services</li>
              <li>To comply with legal obligations</li>
            </ul>
          </div>

          <div className="policy-section" style={{ marginTop: '3rem' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '2rem', fontFamily: 'Playfair Display, serif' }}>Information Sharing</h2>
            <p style={{ color: '#666', marginBottom: '2rem' }}>
              We may share your personal information with:
            </p>
            <ul style={{ color: '#666', marginBottom: '2rem', listStylePosition: 'inside' }}>
              <li>Service providers who assist us in processing orders and providing services</li>
              <li>Marketing partners with your consent</li>
              <li>Law enforcement or other government agencies when required by law</li>
            </ul>
          </div>

          <div className="policy-section" style={{ marginTop: '3rem' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '2rem', fontFamily: 'Playfair Display, serif' }}>Data Security</h2>
            <p style={{ color: '#666', marginBottom: '2rem' }}>
              We take reasonable measures to protect your personal information from unauthorized access, use, or disclosure. However, no method of transmission over the internet is completely secure, and we cannot guarantee the absolute security of your data.
            </p>
          </div>

          <div className="policy-section" style={{ marginTop: '3rem' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '2rem', fontFamily: 'Playfair Display, serif' }}>Your Rights</h2>
            <p style={{ color: '#666', marginBottom: '2rem' }}>
              You have the right to:
            </p>
            <ul style={{ color: '#666', marginBottom: '2rem', listStylePosition: 'inside' }}>
              <li>Access your personal information</li>
              <li>Correct any inaccuracies in your personal information</li>
              <li>Delete your personal information</li>
              <li>Opt out of marketing communications</li>
              <li>Restrict or object to the processing of your personal information</li>
            </ul>
          </div>

          <div className="policy-section" style={{ marginTop: '3rem' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '2rem', fontFamily: 'Playfair Display, serif' }}>Changes to This Privacy Policy</h2>
            <p style={{ color: '#666', marginBottom: '2rem' }}>
              We may update this privacy policy from time to time. We will notify you of any changes by posting the updated policy on our website.
            </p>
          </div>

          <div className="policy-section" style={{ marginTop: '3rem' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '2rem', fontFamily: 'Playfair Display, serif' }}>Contact Us</h2>
            <p style={{ color: '#666', marginBottom: '2rem' }}>
              If you have any questions about this privacy policy or how we handle your personal information, please contact us at:
            </p>
            <p style={{ color: '#666', marginBottom: '2rem' }}>
              Email: privacy@luminabeauty.com<br />
              Phone: +1 (234) 567-890<br />
              Address: 123 Beauty Avenue, New York, NY 10001
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;