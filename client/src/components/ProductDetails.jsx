import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import WishlistButton from './WishlistButton';
import Popup from './Popup';
import { 
  ChevronRight, 
  Star, 
  ShieldCheck, 
  Truck, 
  RotateCcw,
  ShoppingBag,
  ArrowRight,
  Bell
} from 'lucide-react';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('description');
  const [quantity, setQuantity] = useState(1);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [notificationRequested, setNotificationRequested] = useState(false);
  const showAlert = (title, message, type = 'info') => {
    window.dispatchEvent(new CustomEvent('showPopup', { 
      detail: { title, message, type } 
    }));
  };

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`https://luminabeauty.onrender.com/api/products/${id}`);
        setProduct(res.data);
        
        // Check if user already requested notification
        if (user) {
          const token = localStorage.getItem('token');
          const notifyRes = await axios.get(`https://luminabeauty.onrender.com/api/notifications/user/${user.email}`, {
            headers: { 'x-auth-token': token }
          });
          const hasRequested = notifyRes.data.some(n => n.productId?._id === id && n.status === 'pending');
          setNotificationRequested(hasRequested);
        }

        // Fetch all products to filter for related ones
        const allRes = await axios.get('https://luminabeauty.onrender.com/api/products');
        const related = allRes.data
          .filter(p => p.category === res.data.category && p._id !== id)
          .slice(0, 4);
        setRelatedProducts(related);
        
        setLoading(false);
        window.scrollTo(0, 0);
      } catch (err) {
        console.error('Error fetching product data', err);
        setLoading(false);
      }
    };
    fetchProductData();
  }, [id, user]);

  const handleNotifyMe = async () => {
    if (!user) {
      showAlert('Sign In Required', 'Please login to request notification', 'info');
      setTimeout(() => navigate('/login'), 2000);
      return;
    }

    try {
      await axios.post('https://luminabeauty.onrender.com/api/notifications/request', {
        productId: id,
        userEmail: user.email,
        userName: user.name
      });
      setNotificationRequested(true);
      showAlert('Request Received', 'We will notify you when this product is back in stock!', 'success');
    } catch (err) {
      console.error('Error requesting notification', err);
      showAlert('Error', 'Failed to request notification. Please try again.', 'error');
    }
  };

  const handleBuyNow = () => {
    if (product.stock <= 0) return;
    handleAddToCart();
    navigate('/checkout');
  };

  const handleAddToCart = () => {
    if (product.stock <= 0) return;
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingIndex = cart.findIndex(item => item._id === product._id);
    
    if (existingIndex > -1) {
      cart[existingIndex].quantity = (cart[existingIndex].quantity || 1) + quantity;
    } else {
      cart.push({ ...product, quantity });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cartUpdated'));
    showAlert('Added to Bag', `${product.name} has been added to your shopping bag.`, 'success');
  };

  if (loading) return <div className="loader-container"><div className="loader"></div></div>;
  if (!product) return <div className="section" style={{ textAlign: 'center' }}><h2>Product not found</h2><Link to="/">Back to Home</Link></div>;

  const renderTabContent = () => {
    switch (activeTab) {
      case 'description':
        return (
          <div className="tab-pane">
            <p>{product.description} This meticulously formulated product combines natural botanical extracts with advanced dermatological science to deliver visible results while maintaining the skin's natural balance.</p>
            <p style={{ marginTop: '1rem' }}>Perfect for all skin types, including sensitive skin. Our commitment to clean beauty means this product is free from parabens, sulfates, and synthetic fragrances. 100% Cruelty-free and Vegan.</p>
          </div>
        );
      case 'ingredients':
        return (
          <div className="tab-pane">
            <p><strong>Key Ingredients:</strong></p>
            <ul style={{ listStyle: 'none', marginTop: '1rem' }}>
              <li>• Organic Botanical Extracts</li>
              <li>• Pure Essential Oils</li>
              <li>• Plant-derived Squalane</li>
              <li>• Hyaluronic Acid</li>
              <li>• Vitamin C & E</li>
            </ul>
          </div>
        );
      case 'usage':
        return (
          <div className="tab-pane">
            <p>Apply a small amount to clean, dry skin. Gently massage in upward circular motions until fully absorbed. For best results, use twice daily, morning and evening, as part of your Lumina ritual.</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="product-details-page">
      {/* Breadcrumbs */}
      <nav className="breadcrumbs">
        <div className="container">
          <Link to="/">Home</Link>
          <ChevronRight size={14} />
          <span>{product.category}</span>
          <ChevronRight size={14} />
          <span className="current">{product.name}</span>
        </div>
      </nav>

      <section className="section product-main">
        <div className="product-main-grid">
          <div className="product-gallery">
            <div className="main-image-container">
              <img src={product.image} alt={product.name} />
            </div>
          </div>

          <div className="product-buy-info">
            <span className="product-category-label">{product.category}</span>
            <h1 className="product-title">{product.name}</h1>
            
            <div className="product-rating">
              <div className="stars">
                {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="var(--accent)" color="var(--accent)" />)}
              </div>
              <span>(24 Reviews)</span>
            </div>

            <p className="product-price-large">${product.price}</p>
            
            <div className="stock-status" style={{ marginBottom: '1.5rem' }}>
              {product.stock > 0 ? (
                <span style={{ color: '#27ae60', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <ShieldCheck size={18} /> In Stock ({product.stock} available)
                </span>
              ) : (
                <span style={{ color: '#d9534f', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Bell size={18} /> Out of Stock
                </span>
              )}
            </div>

            <p className="product-description-short">
              {product.description}
            </p>

            <div className="purchase-actions" style={{ display: 'flex', gap: '1rem', marginTop: '2rem', flexWrap: 'wrap' }}>
              {product.stock > 0 ? (
                <>
                  <div className="quantity-selector" style={{ display: 'flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: '8px', padding: '0.5rem' }}>
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} style={{ background: 'none', border: 'none', padding: '0 1rem', cursor: 'pointer', fontSize: '1.2rem' }}>-</button>
                    <span style={{ minWidth: '2rem', textAlign: 'center', fontWeight: '500' }}>{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)} style={{ background: 'none', border: 'none', padding: '0 1rem', cursor: 'pointer', fontSize: '1.2rem' }}>+</button>
                  </div>
                  <button 
                    className="btn btn-primary btn-add-cart" 
                    onClick={handleAddToCart}
                    style={{ flex: 1, minWidth: '150px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', padding: '1rem' }}
                  >
                    Add to Bag <ShoppingBag size={18} />
                  </button>
                  <button 
                    className="btn btn-outline" 
                    onClick={handleBuyNow}
                    style={{ flex: 1, minWidth: '150px', padding: '1rem', borderColor: 'var(--accent)', color: 'var(--accent)' }}
                  >
                    Buy Now
                  </button>
                </>
              ) : (
                <button 
                  className="btn btn-primary" 
                  onClick={handleNotifyMe}
                  disabled={notificationRequested}
                  style={{ flex: 2, padding: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}
                >
                  <Bell size={18} /> {notificationRequested ? 'Notification Requested' : 'Notify Me When In Stock'}
                </button>
              )}
              <WishlistButton product={product} className="product-details-wishlist" />
            </div>

            <div className="product-perks">
              <div className="perk-item">
                <Truck size={20} />
                <div>
                  <p className="perk-title">Complimentary Shipping</p>
                  <p className="perk-desc">On all orders over $75</p>
                </div>
              </div>
              <div className="perk-item">
                <RotateCcw size={20} />
                <div>
                  <p className="perk-title">Hassle-Free Returns</p>
                  <p className="perk-desc">30-day return policy</p>
                </div>
              </div>
              <div className="perk-item">
                <ShieldCheck size={20} />
                <div>
                  <p className="perk-title">Authenticity Guaranteed</p>
                  <p className="perk-desc">100% genuine products</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Info Tabs */}
      <section className="section product-tabs">
        <div className="tabs-header">
          <button 
            className={activeTab === 'description' ? 'active' : ''} 
            onClick={() => setActiveTab('description')}
          >
            Description
          </button>
          <button 
            className={activeTab === 'ingredients' ? 'active' : ''} 
            onClick={() => setActiveTab('ingredients')}
          >
            Ingredients
          </button>
          <button 
            className={activeTab === 'usage' ? 'active' : ''} 
            onClick={() => setActiveTab('usage')}
          >
            How to Use
          </button>
        </div>
        <div className="tab-content">
          {renderTabContent()}
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="section related-products">
          <div className="section-header">
            <span>Pairs Well With</span>
            <h2>Complete the Ritual</h2>
          </div>
          <div className="product-grid">
            {relatedProducts.map((p) => (
              <div key={p._id} className="product-card">
                <Link to={`/product/${p._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div className="product-image-container">
                    <img src={p.image} alt={p.name} className="product-image" />
                    <WishlistButton product={p} />
                  </div>
                  <div className="product-info">
                    <p className="product-category">{p.category}</p>
                    <h3>{p.name}</h3>
                    <p className="price">${p.price}</p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetails;
