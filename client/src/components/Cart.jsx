import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowRight, X, ShoppingCart, Plus, Minus } from 'lucide-react';
import Popup from './Popup';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [popup, setPopup] = useState({ isOpen: false, title: '', message: '', type: 'info', onConfirm: null, showCancel: false });
  const navigate = useNavigate();

  const showConfirm = (title, message, onConfirm) => {
    setPopup({ isOpen: true, title, message, type: 'warning', showCancel: true, onConfirm });
  };

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartItems(cart);
  }, []);

  const updateQuantity = (id, delta) => {
    setIsUpdating(true);
    setTimeout(() => setIsUpdating(false), 300);
    
    const updated = cartItems.map(item => {
      if (item._id === id) {
        return { ...item, quantity: Math.max(1, (item.quantity || 1) + delta) };
      }
      return item;
    });
    setCartItems(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
  };

  const removeItem = (id) => {
    const updated = cartItems.filter(item => item._id !== id);
    setCartItems(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0);
  };

  const calculateShipping = () => {
    const subtotal = calculateSubtotal();
    return subtotal > 100 ? 0 : 15;
  };

  const calculateTax = () => {
    const subtotal = calculateSubtotal();
    return subtotal * 0.08;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateShipping() + calculateTax();
  };

  const handleCheckout = () => {
    // Here you would typically validate the cart and proceed to checkout
    if (cartItems.length > 0) {
      navigate('/checkout');
    }
  };

  const clearCart = () => {
    showConfirm(
      'Clear Bag',
      'Are you sure you want to remove all items from your shopping bag?',
      () => {
        setCartItems([]);
        localStorage.setItem('cart', JSON.stringify([]));
        window.dispatchEvent(new Event('cartUpdated'));
      }
    );
  };

  return (
    <div className="cart-page">
      <div className="container">
        <header>
          <h1>Shopping Bag</h1>
          <p>Your selection for a more radiant you.</p>
        </header>

        {cartItems.length > 0 ? (
          <div className="cart-layout">
            <div className="cart-items">
              <div className="cart-items-header">
                <h2>Your Items ({cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0)})</h2>
                <button 
                  onClick={clearCart}
                  className="clear-cart-btn"
                >
                  <Trash2 size={16} /> Clear Cart
                </button>
              </div>
              
              {cartItems.map(item => (
                <div key={item._id} className="cart-item">
                  <div className="cart-item-image">
                    <img src={item.image} alt={item.name} />
                  </div>
                  <div className="cart-item-info">
                    <div className="cart-item-header">
                      <h3>{item.name}</h3>
                      <button 
                        onClick={() => removeItem(item._id)}
                        className="remove-btn"
                        aria-label={`Remove ${item.name}`}
                      >
                        <X size={20} />
                      </button>
                    </div>
                    <p className="cart-item-category">{item.category}</p>
                    <p className="cart-item-price">${item.price.toFixed(2)}</p>
                    <div className="cart-item-footer">
                      <div className="quantity-selector">
                        <button 
                          onClick={() => updateQuantity(item._id, -1)}
                          className="quantity-btn"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="quantity-display">{item.quantity || 1}</span>
                        <button 
                          onClick={() => updateQuantity(item._id, 1)}
                          className="quantity-btn"
                          aria-label="Increase quantity"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      <p className="cart-item-total">
                        ${(item.price * (item.quantity || 1)).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <h3>Order Summary</h3>
              
              <div className="summary-row">
                <span>Subtotal</span>
                <span>${calculateSubtotal().toFixed(2)}</span>
              </div>
              
              <div className="summary-row">
                <span>Shipping</span>
                <span>
                  {calculateShipping() === 0 ? 'Free' : `$${calculateShipping().toFixed(2)}`}
                </span>
              </div>
              
              <div className="summary-row">
                <span>Tax</span>
                <span>${calculateTax().toFixed(2)}</span>
              </div>
              
              <div className="summary-row total">
                <span>Total</span>
                <span>${calculateTotal().toFixed(2)}</span>
              </div>

              {calculateShipping() === 0 && (
                <div className="free-shipping-badge">
                  ✓ Free Shipping on orders over $100
                </div>
              )}

              <button 
                onClick={handleCheckout}
                className="btn btn-primary checkout-btn"
                disabled={isUpdating}
              >
                {isUpdating ? 'Updating...' : 'Proceed to Checkout'} 
                <ArrowRight size={18} />
              </button>
              
              <Link to="/" className="continue-shopping">
                <ShoppingBag size={16} /> Continue Shopping
              </Link>

              <div className="cart-summary-info">
                <p>• Secure checkout</p>
                <p>• Free shipping on orders over $100</p>
                <p>• Easy returns within 30 days</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="cart-empty">
            <div className="empty-cart-animation">
              <ShoppingCart size={80} color="#e0e0e0" className="empty-icon" />
            </div>
            <h2>Your shopping bag is empty</h2>
            <p>Discover our collection to find your perfect beauty essentials and start your journey to radiant beauty.</p>
            <Link to="/" className="btn btn-primary">Explore Products</Link>
          </div>
        )}
      </div>
      <Popup {...popup} onClose={() => setPopup({ ...popup, isOpen: false })} />
    </div>
  );
};

export default Cart;
