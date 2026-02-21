import React from 'react';
import { MapPin } from 'lucide-react';

const OurStores = () => {
  const stores = [
    {
      name: 'New York',
      address: '123 Beauty Avenue, New York, NY 10001',
      phone: '+1 (212) 555-1234',
      hours: 'Mon-Sat: 10am-8pm, Sun: 12pm-6pm'
    },
    {
      name: 'Paris',
      address: '45 Rue de la Beauté, 75001 Paris, France',
      phone: '+33 1 23 45 67 89',
      hours: 'Mon-Sat: 10am-7pm, Sun: 1pm-6pm'
    },
    {
      name: 'London',
      address: '789 Beauty Street, London WC1A 1AA, UK',
      phone: '+44 (0)20 1234 5678',
      hours: 'Mon-Sat: 9am-8pm, Sun: 11am-6pm'
    },
    {
      name: 'Tokyo',
      address: '101 Beauty Avenue, Shibuya, Tokyo 150-0002, Japan',
      phone: '+81 3 1234 5678',
      hours: 'Mon-Sun: 10am-8pm'
    }
  ];

  return (
    <div className="our-stores-page" style={{ paddingTop: '10rem', paddingBottom: '5rem' }}>
      <div className="container" style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 8%' }}>
        <header className="our-stores-header" style={{ marginBottom: '4rem', textAlign: 'center' }}>
          <span style={{ textTransform: 'uppercase', letterSpacing: '4px', fontSize: '0.8rem', color: '#888' }}>Visit Us</span>
          <h1 style={{ fontSize: '3.5rem', fontFamily: 'Playfair Display, serif', marginTop: '1rem' }}>Our Stores</h1>
          <p style={{ maxWidth: '600px', margin: '1.5rem auto 0', color: '#666', fontWeight: '300' }}>
            Experience LUMINA beauty firsthand at our flagship stores around the world.
          </p>
        </header>

        <div className="stores-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem' }}>
          {stores.map((store, index) => (
            <div key={index} className="store-card" style={{ background: 'white', padding: '2rem', borderRadius: '5px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', transition: 'transform 0.3s ease' }} onMouseEnter={(e) => e.target.style.transform = 'translateY(-5px)'} onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                <MapPin size={24} color="var(--accent)" style={{ marginRight: '1rem' }} />
                <h3 style={{ fontSize: '1.5rem', fontFamily: 'Playfair Display, serif' }}>{store.name}</h3>
              </div>
              <p style={{ color: '#666', marginBottom: '1rem' }}>{store.address}</p>
              <p style={{ color: 'var(--accent)', marginBottom: '1rem' }}>{store.phone}</p>
              <p style={{ color: '#666' }}>{store.hours}</p>
            </div>
          ))}
        </div>

        <div className="store-location" style={{ marginTop: '5rem', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '2rem', fontFamily: 'Playfair Display, serif' }}>Find a Store Near You</h2>
          <p style={{ color: '#666', marginBottom: '2rem' }}>
            Use our store locator to find the nearest LUMINA store.
          </p>
          <a href="/store-locator" style={{ background: 'var(--accent)', color: 'white', padding: '1rem 2rem', borderRadius: '5px', textDecoration: 'none', fontWeight: '600', transition: 'background 0.3s ease' }}>
            Store Locator
          </a>
        </div>
      </div>
    </div>
  );
};

export default OurStores;