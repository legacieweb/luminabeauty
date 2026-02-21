import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';

const WishlistButton = ({ product, className = "" }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const checkWishlist = () => {
      const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
      setIsWishlisted(wishlist.some(item => item._id === product._id));
    };

    checkWishlist();
    window.addEventListener('wishlistUpdated', checkWishlist);
    return () => window.removeEventListener('wishlistUpdated', checkWishlist);
  }, [product._id]);

  const toggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    const exists = wishlist.some(item => item._id === product._id);
    let newWishlist;

    if (exists) {
      newWishlist = wishlist.filter(item => item._id !== product._id);
    } else {
      newWishlist = [...wishlist, product];
      // Trigger toast
      window.dispatchEvent(new CustomEvent('showToast', { detail: 'Saved to your favorites' }));
    }

    localStorage.setItem('wishlist', JSON.stringify(newWishlist));
    setIsWishlisted(!exists);
    
    // Only animate on click
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 600);

    // Dispatch event for other components to update
    window.dispatchEvent(new Event('wishlistUpdated'));
  };

  return (
    <button 
      className={`modern-wishlist-btn ${isWishlisted ? 'active' : ''} ${isAnimating ? 'animate' : ''} ${className}`}
      onClick={toggleWishlist}
      aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
    >
      <Heart 
        size={22} 
        strokeWidth={1.5} 
        className="heart-icon"
      />
    </button>
  );
};

export default WishlistButton;
