import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  Mail, 
  Phone, 
  MapPin, 
  Instagram, 
  Facebook, 
  Twitter, 
  Heart,
  Menu,
  X,
  Search
} from 'lucide-react';
import './App.css';
import Home from './components/Home';
import ProductDetails from './components/ProductDetails';
import Contact from './components/Contact';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard.jsx';
import AdminDashboard from './components/AdminDashboard.jsx';
import Collection from './components/Collection';
import Wishlist from './components/Wishlist';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import SearchResults from './components/SearchResults';
import Support from './components/Support';
import Shipping from './components/Shipping';
import Returns from './components/Returns';
import Concierge from './components/Concierge';
import FAQ from './components/FAQ';
import OurStores from './components/OurStores';
import NewYork from './components/NewYork';
import Paris from './components/Paris';
import London from './components/London';
import Tokyo from './components/Tokyo';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfService from './components/TermsOfService';

import Popup from './components/Popup';

const App = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [cartCount, setCartCount] = useState(0);
  const [toast, setToast] = useState({ show: false, message: '' });
  const [popup, setPopup] = useState({ 
    show: false, 
    title: '', 
    message: '', 
    type: 'success', 
    onConfirm: null, 
    showConfirm: false 
  });
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleShowPopup = (e) => {
      setPopup({
        show: true,
        title: e.detail.title || 'Notification',
        message: e.detail.message,
        type: e.detail.type || 'success',
        onConfirm: e.detail.onConfirm || null,
        showConfirm: e.detail.showConfirm || false
      });
    };

    window.addEventListener('showPopup', handleShowPopup);
    return () => window.removeEventListener('showPopup', handleShowPopup);
  }, []);

  useEffect(() => {
    const checkUserStatus = async () => {
      const storedUser = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      if (storedUser && token) {
        try {
          const parsedUser = JSON.parse(storedUser);
          if (parsedUser.role === 'admin') return; // Skip for admin

          // Simple ping to an auth route to check status via middleware
          await axios.get('http://localhost:5000/api/users/addresses', {
            headers: { 'x-auth-token': token }
          });
        } catch (err) {
          if (err.response && (err.response.status === 401 || err.response.status === 403)) {
            // Token invalid or user suspended
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUser(null);
            if (err.response.status === 403) {
              window.dispatchEvent(new CustomEvent('showPopup', { 
                detail: { 
                  title: 'Account Suspended',
                  message: 'Your account has been suspended. Please contact support.',
                  type: 'error'
                } 
              }));
            }
            navigate('/');
          }
        }
      }
    };

    checkUserStatus();
    const interval = setInterval(checkUserStatus, 30000); // Check every 30s
    return () => clearInterval(interval);
  }, [location, navigate]);

  useEffect(() => {
    const handleShowToast = (e) => {
      setToast({ show: true, message: e.detail });
      setTimeout(() => setToast({ show: false, message: '' }), 3000);
    };

    window.addEventListener('showToast', handleShowToast);
    return () => window.removeEventListener('showToast', handleShowToast);
  }, []);

  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const count = cart.reduce((acc, item) => acc + (item.quantity || 1), 0);
      setCartCount(count);
    };

    updateCartCount();
    window.addEventListener('storage', updateCartCount);
    // Custom event for same-window updates
    window.addEventListener('cartUpdated', updateCartCount);
    
    return () => {
      window.removeEventListener('storage', updateCartCount);
      window.removeEventListener('cartUpdated', updateCartCount);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.location.reload();
  };

  // Scroll to top when navigated to a new page
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [location]);

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <div className={`app ${menuOpen ? 'menu-open' : ''}`}>
      {/* Main Navbar - hidden only on Admin Dashboard */}
      {!isAdmin && (
        <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
          <Link to="/" className="logo">LUMINA</Link>
          
          <ul className={`nav-links ${menuOpen ? 'active' : ''}`}>
            {/* Search bar for mobile */}
            <li className="mobile-search">
              <div className="search-container">
                <Search 
                  size={20} 
                  className="search-icon" 
                  onClick={(e) => {
                    const searchInput = e.currentTarget.parentElement.querySelector('.search-input');
                    if (searchInput) {
                      searchInput.focus();
                    }
                  }}
                  style={{ cursor: 'pointer' }}
                />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch(e)}
                  className="search-input"
                />
              </div>
            </li>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/collection/skincare">Skincare</Link></li>
            <li><Link to="/collection/makeup">Makeup</Link></li>
            <li><Link to="/collection/fragrance">Fragrance</Link></li>
            {user ? (
              <>
                <li><Link to="/dashboard">Account</Link></li>
                <li><span 
                  onClick={handleLogout} 
                  style={{ 
                    cursor: 'pointer', 
                    color: '#1a1a1a',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '2px',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    padding: '0.5rem 0'
                  }}
                  onMouseEnter={(e) => e.target.style.color = 'var(--accent)'}
                  onMouseLeave={(e) => e.target.style.color = '#1a1a1a'}
                >
                  Logout
                </span></li>
              </>
            ) : (
              <li><Link to="/login">Login</Link></li>
            )}
          </ul>
          
           <div className="nav-icons">
            <Link to="/wishlist" className="icon-btn hide-mobile">
              <Heart size={20} />
            </Link>
            <Link to="/cart" className="icon-btn" style={{ position: 'relative' }}>
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-8px',
                  right: '-8px',
                  background: 'var(--accent)',
                  color: 'white',
                  fontSize: '0.7rem',
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold'
                }}>
                  {cartCount}
                </span>
              )}
            </Link>
            <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </div>
          </div>
        </nav>
      )}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/collection/:category" element={<Collection />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/support" element={<Support />} />
        <Route path="/shipping" element={<Shipping />} />
        <Route path="/returns" element={<Returns />} />
        <Route path="/concierge" element={<Concierge />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/our-stores" element={<OurStores />} />
        <Route path="/new-york" element={<NewYork />} />
        <Route path="/paris" element={<Paris />} />
        <Route path="/london" element={<London />} />
        <Route path="/tokyo" element={<Tokyo />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
      </Routes>

      {location.pathname === '/' && <Contact />}

      {/* Footer */}
      <footer>
        <div className="footer-grid">
          <div className="footer-col">
            <Link to="/" className="logo" style={{ color: '#fff', marginBottom: '2rem', display: 'block' }}>LUMINA</Link>
            <p style={{ color: '#999' }}>Elevating the standard of clean luxury beauty. Ethically sourced, scientifically proven.</p>
            <div className="social-links">
              <Instagram size={20} />
              <Facebook size={20} />
              <Twitter size={20} />
            </div>
          </div>
          <div className="footer-col">
            <h4>Boutique</h4>
            <ul>
              <li><Link to="/collection/skincare">Skincare</Link></li>
              <li><Link to="/collection/makeup">Makeup</Link></li>
              <li><Link to="/collection/fragrance">Fragrance</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Support</h4>
            <ul>
              <li><Link to="/support">Support</Link></li>
              <li><Link to="/shipping">Shipping</Link></li>
              <li><Link to="/returns">Returns</Link></li>
              <li><Link to="/concierge">Concierge</Link></li>
              <li><Link to="/faq">FAQ</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Our Stores</h4>
            <ul>
              <li><Link to="/new-york">New York</Link></li>
              <li><Link to="/paris">Paris</Link></li>
              <li><Link to="/london">London</Link></li>
              <li><Link to="/tokyo">Tokyo</Link></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom" style={{ 
          borderTop: '1px solid #222', 
          paddingTop: '3rem', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          color: '#666', 
          fontSize: '0.8rem'
        }}>
          <p>&copy; 2026 LUMINA BEAUTY INC. ALL RIGHTS RESERVED.</p>
          <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/privacy-policy" style={{ color: '#666', textDecoration: 'none' }}>Privacy Policy</Link>
            <Link to="/terms-of-service" style={{ color: '#666', textDecoration: 'none' }}>Terms of Service</Link>
          </div>
          <p style={{ 
            fontWeight: 600,
            letterSpacing: '1px',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}>
            Designed by <a 
              href="https://iyonicorp.com" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ 
                textDecoration: 'none',
                fontWeight: 700,
                position: 'relative',
                display: 'inline-block',
                background: 'linear-gradient(45deg, #ff6b6b, #feca57, #48dbfb, #ff9ff3)',
                backgroundSize: '400% 400%',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                animation: 'gradientShift 3s ease infinite',
                filter: 'drop-shadow(0 0 8px rgba(255, 107, 107, 0.8)) drop-shadow(0 0 16px rgba(254, 202, 87, 0.6)) drop-shadow(0 0 24px rgba(72, 219, 251, 0.4))'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'scale(1.1)';
                e.target.style.filter = 'drop-shadow(0 0 16px rgba(255, 107, 107, 1)) drop-shadow(0 0 32px rgba(254, 202, 87, 0.8)) drop-shadow(0 0 48px rgba(72, 219, 251, 0.6))';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'scale(1)';
                e.target.style.filter = 'drop-shadow(0 0 8px rgba(255, 107, 107, 0.8)) drop-shadow(0 0 16px rgba(254, 202, 87, 0.6)) drop-shadow(0 0 24px rgba(72, 219, 251, 0.4))';
              }}
            >
              iyonicorp
            </a>
          </p>
        </div>
      </footer>

      {/* Toast Notification */}
      <div className={`toast-container ${toast.show ? 'show' : ''}`}>
        <div className="toast-message">{toast.message}</div>
      </div>
      {/* Popup Notification */}
      <Popup 
        show={popup.show}
        title={popup.title}
        message={popup.message}
        type={popup.type}
        onClose={() => setPopup({ ...popup, show: false })}
        onConfirm={popup.onConfirm}
        showConfirm={popup.showConfirm}
      />
    </div>
  );
};

export default App;
