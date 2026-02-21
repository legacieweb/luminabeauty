import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import WishlistButton from './WishlistButton';
import { 
  ArrowRight,
  Star,
  ShieldCheck,
  Leaf,
  Heart
} from 'lucide-react';

const Home = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/products');
      setProducts(res.data);
    } catch (err) {
      console.error('Error fetching products', err);
    }
  };

  return (
    <>
      {/* Hero */}
      <header id="home" className="hero">
        <div className="hero-content">
          <span>Ethical • Organic • Luxury</span>
          <h1>The Essence of Natural Radiance</h1>
          <p>Experience the purity of nature through our dermatologically crafted luxury skincare and cosmetics.</p>
          <div className="hero-btns">
            <a href="#products" className="btn btn-primary">Discover Shop</a>
            <a href="#collections" className="btn btn-outline">Explore Collections</a>
          </div>
        </div>
      </header>

      {/* Featured Collections */}
      <section id="collections" className="section">
        <div className="section-header">
          <span>Curated For You</span>
          <h2>The Seasonal Edit</h2>
        </div>
        <div className="collections-grid">
          <Link to="/collection/skincare" className="collection-item">
            <img src="https://fentybeauty.com/cdn/shop/files/HP-M_2.jpg?crop=center&height=700&v=1753211668&width=1036" alt="Skincare" />
            <div className="collection-overlay">
              <h3>Essential Skincare</h3>
              <p>Daily rituals for glowing skin</p>
            </div>
          </Link>
          <Link to="/collection/makeup" className="collection-item">
            <img src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=800" alt="Makeup" />
            <div className="collection-overlay">
              <h3>Artisan Makeup</h3>
              <p>Bold colors, clean ingredients</p>
            </div>
          </Link>
          <Link to="/collection/fragrance" className="collection-item">
            <img src="https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=800" alt="Fragrance" />
            <div className="collection-overlay">
              <h3>Signature Scents</h3>
              <p>Ethereal floral notes</p>
            </div>
          </Link>
        </div>
      </section>

      {/* Values Section */}
      <section className="section values-section">
        <div className="values-grid">
          <div className="value-item">
            <Leaf size={40} color="var(--accent)" style={{ marginBottom: '1.5rem' }} />
            <h3>100% Organic</h3>
            <p>Every ingredient is ethically sourced and certified organic.</p>
          </div>
          <div className="value-item">
            <ShieldCheck size={40} color="var(--accent)" style={{ marginBottom: '1.5rem' }} />
            <h3>Dermatologist Tested</h3>
            <p>Proven results for even the most sensitive skin types.</p>
          </div>
          <div className="value-item">
            <Heart size={40} color="var(--accent)" style={{ marginBottom: '1.5rem' }} />
            <h3>Cruelty Free</h3>
            <p>We believe in beauty without harm. Never tested on animals.</p>
          </div>
        </div>
      </section>

      {/* Products */}
      <section id="products" className="section">
        <div className="section-header">
          <span>Our Boutique</span>
          <h2>Bestselling Formulas</h2>
        </div>
        <div className="product-grid">
          {products.length > 0 ? (
            products.map((product) => (
              <div key={product._id} className="product-card">
                <Link to={`/product/${product._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div className="product-image-container" style={{ position: 'relative' }}>
                    <img src={product.image} alt={product.name} className="product-image" />
                    {product.stock <= 0 && (
                      <div style={{
                        position: 'absolute',
                        top: '10px',
                        left: '10px',
                        background: 'rgba(217, 83, 79, 0.9)',
                        color: 'white',
                        padding: '4px 8px',
                        fontSize: '0.7rem',
                        fontWeight: '600',
                        textTransform: 'uppercase',
                        borderRadius: '2px',
                        letterSpacing: '1px',
                        zIndex: 1
                      }}>
                        Out of Stock
                      </div>
                    )}
                    <WishlistButton product={product} />
                  </div>
                  <div className="product-info">
                    <p className="product-category">{product.category}</p>
                    <h3>{product.name}</h3>
                    <p className="price">${product.price}</p>
                  </div>
                </Link>
              </div>
            ))
          ) : (
            <p style={{ textAlign: 'center', gridColumn: '1/-1' }}>Refreshing our boutique...</p>
          )}
        </div>
        <div className="view-all-container">
          <button className="btn btn-primary">View All Products <ArrowRight size={16} /></button>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section testimonials">
        <div className="testimonial-card">
          <div style={{ display: 'flex', justifyContent: 'center', gap: '5px', marginBottom: '2rem' }}>
            {[...Array(5)].map((_, i) => <Star key={i} size={18} fill="var(--accent)" color="var(--accent)" />)}
          </div>
          <p>"The Radiance Glow Serum transformed my skin within weeks. I've never felt more confident in my natural skin than I do now. Lumina is a game-changer."</p>
          <h4 style={{ textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.9rem' }}>— Elena Rodriguez, Vogue Contributor</h4>
        </div>
      </section>

      {/* Philosophy Section */}
      <section id="about" className="section">
        <div className="philosophy-grid">
          <div className="philosophy-content">
            <span className="subtitle">Our Heritage</span>
            <h2>Beauty Rooted in Nature</h2>
            <p>Founded on the principles of holistic wellness, Lumina brings together centuries-old botanical wisdom and modern dermatological science.</p>
            <p>We don't just create products; we create rituals. Each bottle is a testament to our commitment to purity, sustainability, and the undeniable power of nature.</p>
            <a href="#" className="btn btn-primary">Read Our Story</a>
          </div>
          <div className="philosophy-image">
            <img src="https://img.freepik.com/free-photo/beauty-blondy-woman-looking-camera_633478-305.jpg?semt=ais_hybrid&w=740&q=80" alt="Process" />
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
