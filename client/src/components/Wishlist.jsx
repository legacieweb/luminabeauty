import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowRight, Heart } from 'lucide-react';
import WishlistButton from './WishlistButton';

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);

  const loadWishlist = () => {
    const items = JSON.parse(localStorage.getItem('wishlist') || '[]');
    setWishlist(items);
  };

  useEffect(() => {
    loadWishlist();
    window.addEventListener('wishlistUpdated', loadWishlist);
    return () => window.removeEventListener('wishlistUpdated', loadWishlist);
  }, []);

  const handleAddToCart = (item) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingIndex = cart.findIndex(c => c._id === item._id);
    if (existingIndex > -1) {
      cart[existingIndex].quantity += 1;
    } else {
      cart.push({ ...item, quantity: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cartUpdated'));
    window.dispatchEvent(new CustomEvent('showToast', { detail: 'Added to your bag' }));
  };

  return (
    <div className="wishlist-page modern-wishlist-page">
      <div className="container">
        <header className="wishlist-header">
          <span className="subtitle">Curated Collection</span>
          <h1>My Favorites</h1>
          <p>Your personal sanctuary of beauty essentials and desired rituals.</p>
        </header>

        {wishlist.length > 0 ? (
          <div className="wishlist-grid-container">
            <div className="wishlist-grid">
              {wishlist.map(item => (
                <div key={item._id} className="wishlist-item-card">
                  <div className="wishlist-item-image">
                    <Link to={`/product/${item._id}`}>
                      <img src={item.image} alt={item.name} />
                    </Link>
                    <WishlistButton product={item} className="wishlist-remove-float" />
                  </div>
                  <div className="wishlist-item-content">
                    <div className="wishlist-item-info">
                      <span className="wishlist-item-category">{item.category}</span>
                      <h3 className="wishlist-item-name">{item.name}</h3>
                      <p className="wishlist-item-price">${item.price}</p>
                    </div>
                    <div className="wishlist-item-actions">
                      <button 
                        className="wishlist-action-btn primary"
                        onClick={() => handleAddToCart(item)}
                      >
                        <ShoppingBag size={16} />
                        <span>Add to Bag</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="wishlist-empty-state">
            <div className="empty-icon-wrapper">
              <Heart size={48} strokeWidth={1} />
            </div>
            <h2>Your collection is empty</h2>
            <p>Start exploring our rituals to find your next beauty essential.</p>
            <Link to="/collection/skincare" className="btn btn-primary">
              Explore Skincare <ArrowRight size={16} />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
