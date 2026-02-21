import React, { useState } from 'react';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: 'How do I place an order?',
      answer: 'To place an order, browse our products and add items to your shopping bag. Once you\'re ready to checkout, click the shopping bag icon in the top right corner and follow the steps to complete your purchase.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards, PayPal, and Apple Pay. For international orders, we also accept various local payment methods.'
    },
    {
      question: 'How long will it take to receive my order?',
      answer: 'Delivery times depend on your location and the shipping method you choose. Standard shipping takes 5-7 business days, express shipping takes 2-3 business days, and next day shipping takes 1 business day.'
    },
    {
      question: 'Can I track my order?',
      answer: 'Yes, you will receive a tracking number via email once your order ships. You can use this tracking number to monitor the status of your delivery.'
    },
    {
      question: 'What is your return policy?',
      answer: 'We offer a 30-day return policy. Items must be returned in their original condition, unused, and in their original packaging. We provide free returns on all orders.'
    },
    {
      question: 'Do you offer international shipping?',
      answer: 'Yes, we offer international shipping to select countries. Shipping rates and delivery times vary by destination.'
    },
    {
      question: 'How can I contact customer support?',
      answer: 'You can contact our customer support team via email at support@luminabeauty.com, by phone at +1 (234) 567-890, or by using the contact form on our support page.'
    },
    {
      question: 'Are your products cruelty-free?',
      answer: 'Yes, all our products are cruelty-free and not tested on animals. We are committed to ethical and sustainable beauty practices.'
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="faq-page" style={{ paddingTop: '10rem', paddingBottom: '5rem' }}>
      <div className="container" style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 8%' }}>
        <header className="faq-header" style={{ marginBottom: '4rem', textAlign: 'center' }}>
          <span style={{ textTransform: 'uppercase', letterSpacing: '4px', fontSize: '0.8rem', color: '#888' }}>Help & Support</span>
          <h1 style={{ fontSize: '3.5rem', fontFamily: 'Playfair Display, serif', marginTop: '1rem' }}>Frequently Asked Questions</h1>
          <p style={{ maxWidth: '600px', margin: '1.5rem auto 0', color: '#666', fontWeight: '300' }}>
            Find answers to some of our most commonly asked questions. If you can't find what you're looking for, please don't hesitate to contact us.
          </p>
        </header>

        <div className="faq-content">
          {faqs.map((faq, index) => (
            <div key={index} className="faq-item" style={{ marginBottom: '1rem' }}>
              <div 
                className="faq-question" 
                style={{ 
                  padding: '1.5rem', 
                  background: '#f5f5f5', 
                  cursor: 'pointer', 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  borderRadius: '5px',
                  transition: 'background 0.3s ease'
                }}
                onClick={() => toggleFAQ(index)}
                onMouseEnter={(e) => e.target.style.background = '#e8e8e8'}
                onMouseLeave={(e) => e.target.style.background = openIndex === index ? '#e8e8e8' : '#f5f5f5'}
              >
                <h3 style={{ fontSize: '1.2rem', fontWeight: '500' }}>{faq.question}</h3>
                <span style={{ fontSize: '1.5rem', color: 'var(--accent)' }}>
                  {openIndex === index ? '−' : '+'}
                </span>
              </div>
              {openIndex === index && (
                <div className="faq-answer" style={{ padding: '1.5rem', background: 'white', border: '1px solid #f0f0f0', borderTop: 'none', borderRadius: '0 0 5px 5px' }}>
                  <p style={{ color: '#666' }}>{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="faq-contact" style={{ marginTop: '5rem', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '2rem', fontFamily: 'Playfair Display, serif' }}>Still Have Questions?</h2>
          <p style={{ color: '#666', marginBottom: '2rem' }}>
            If you can't find the answer to your question, please don't hesitate to contact us.
          </p>
          <a href="/support" style={{ background: 'var(--accent)', color: 'white', padding: '1rem 2rem', borderRadius: '5px', textDecoration: 'none', fontWeight: '600', transition: 'background 0.3s ease' }}>
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
};

export default FAQ;