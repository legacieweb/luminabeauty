import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { PaystackButton } from 'react-paystack';

const Checkout = () => {
  const [cartItems, setCartItems] = useState([]);
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'United States',
    state: ''
  });
  const [saveAddress, setSaveAddress] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const publicKey = "pk_test_232531a5c927ef2cc67ed1b85af3f26e3b8ed2f2";

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    if (cart.length === 0) {
      navigate('/cart');
    }
    setCartItems(cart);

    // Auto-fill user info if logged in
    const fillUserData = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        
        if (!storedUser) return;

        const user = JSON.parse(storedUser);
        if (!user || !user.email) return;

        // Split name into first and last
        const nameParts = user.name ? user.name.split(' ') : ['', ''];
        const baseInfo = {
          email: user.email,
          firstName: nameParts[0] || '',
          lastName: nameParts.slice(1).join(' ') || ''
        };

        let addressInfo = {};
        
        // Fetch addresses if token is available
        if (token) {
          try {
            const res = await axios.get('https://luminabeauty.onrender.com/api/users/addresses', {
              headers: { 'x-auth-token': token }
            });
            
            if (res.data && res.data.length > 0) {
              const defaultAddr = res.data.find(a => a.isDefault) || res.data[0];
              if (defaultAddr) {
                addressInfo = {
                  address: defaultAddr.street || '',
                  city: defaultAddr.city || '',
                  state: defaultAddr.state || '',
                  postalCode: defaultAddr.zip || '',
                  country: defaultAddr.country || 'United States'
                };
              }
            }
          } catch (addrErr) {
            console.error('Error fetching addresses:', addrErr);
          }
        }

        // Consolidated update to prevent race conditions
        setFormData(prev => ({
          ...prev,
          ...baseInfo,
          ...addressInfo
        }));

      } catch (err) {
        console.error('Autofill error:', err);
      }
    };

    fillUserData();
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0);
  };

  const amount = calculateTotal() * 100; // Paystack expects amount in kobo/cents

  const handlePaystackSuccessAction = async (reference) => {
    setLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const token = localStorage.getItem('token');

      // Save address if requested
      if (saveAddress && user) {
        try {
          await axios.post('https://luminabeauty.onrender.com/api/users/addresses', {
            street: formData.address,
            city: formData.city,
            state: formData.state,
            zip: formData.postalCode,
            country: formData.country,
            isDefault: true
          }, {
            headers: { 'x-auth-token': token }
          });
        } catch (addrErr) {
          console.error('Failed to save address:', addrErr);
        }
      }

      const orderData = {
        items: cartItems,
        shippingDetails: formData,
        total: calculateTotal(),
        paymentReference: reference.reference,
        userId: user?.id
      };
      
      await axios.post('https://luminabeauty.onrender.com/api/checkout', orderData);
      
      localStorage.removeItem('cart');
      
      window.dispatchEvent(new CustomEvent('showPopup', {
        detail: {
          title: 'Order Successful',
          message: 'Your order has been placed successfully! A confirmation email has been sent.',
          type: 'success'
        }
      }));
      navigate('/dashboard');
    } catch (err) {
      console.error('Checkout error:', err);
      window.dispatchEvent(new CustomEvent('showPopup', {
        detail: {
          title: 'Order Processing Failed',
          message: 'Payment was successful but we had trouble saving your order. Please contact support with reference: ' + reference.reference,
          type: 'error'
        }
      }));
    } finally {
      setLoading(false);
    }
  };

  const handlePaystackCloseAction = () => {
    window.dispatchEvent(new CustomEvent('showPopup', {
      detail: {
        title: 'Payment Cancelled',
        message: 'You have closed the payment window.',
        type: 'info'
      }
    }));
  };

  const componentProps = {
    email: formData.email,
    amount,
    currency: "USD",
    metadata: {
      name: `${formData.firstName} ${formData.lastName}`,
    },
    publicKey,
    text: `Pay $${calculateTotal()}`,
    onSuccess: (reference) => handlePaystackSuccessAction(reference),
    onClose: handlePaystackCloseAction,
  };

  const isFormValid = formData.email && formData.firstName && formData.lastName && formData.address && formData.city && formData.postalCode && formData.state;

  return (
    <>
      {loading && (
        <div className="preloader-overlay">
          <div className="loader"></div>
          <p>Processing your order...</p>
        </div>
      )}
      <div className="checkout-page" style={{ paddingTop: '10rem', paddingBottom: '5rem' }}>
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 8%' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '5rem' }}>
          <div className="checkout-form-container">
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '2rem', marginBottom: '2rem' }}>Shipping Information</h2>
            <form onSubmit={(e) => e.preventDefault()} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem', display: 'block' }}>First Name</label>
                  <input type="text" name="firstName" value={formData.firstName} placeholder="Jane" required onChange={handleChange} style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '4px' }} />
                </div>
                <div className="form-group">
                  <label style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem', display: 'block' }}>Last Name</label>
                  <input type="text" name="lastName" value={formData.lastName} placeholder="Doe" required onChange={handleChange} style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '4px' }} />
                </div>
              </div>
              
              <div className="form-group">
                <label style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem', display: 'block' }}>Email</label>
                <input type="email" name="email" value={formData.email} placeholder="jane.doe@example.com" required onChange={handleChange} style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '4px' }} />
              </div>

              <div className="form-group">
                <label style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem', display: 'block' }}>Address</label>
                <input type="text" name="address" value={formData.address} placeholder="123 Luxury Ave" required onChange={handleChange} style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '4px' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem', display: 'block' }}>City</label>
                  <input type="text" name="city" value={formData.city} placeholder="New York" required onChange={handleChange} style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '4px' }} />
                </div>
                <div className="form-group">
                  <label style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem', display: 'block' }}>State / Province</label>
                  <input type="text" name="state" value={formData.state} placeholder="NY" required onChange={handleChange} style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '4px' }} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem', display: 'block' }}>Postal Code</label>
                  <input type="text" name="postalCode" value={formData.postalCode} placeholder="10001" required onChange={handleChange} style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '4px' }} />
                </div>
                <div className="form-group">
                  <label style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem', display: 'block' }}>Country</label>
                  <input type="text" name="country" value={formData.country} placeholder="United States" required onChange={handleChange} style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '4px' }} />
                </div>
              </div>

              <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem' }}>
                <input 
                  type="checkbox" 
                  id="saveAddress" 
                  checked={saveAddress} 
                  onChange={(e) => setSaveAddress(e.target.checked)} 
                  style={{ width: 'auto' }}
                />
                <label htmlFor="saveAddress" style={{ fontSize: '0.9rem', cursor: 'pointer' }}>Save this address for future use</label>
              </div>

              {isFormValid ? (
                <PaystackButton 
                  className="btn btn-primary" 
                  {...componentProps}
                  style={{ marginTop: '2rem', padding: '1.2rem', fontSize: '1rem', cursor: 'pointer' }}
                />
              ) : (
                <button 
                  type="button" 
                  className="btn btn-primary" 
                  disabled={true}
                  style={{ marginTop: '2rem', padding: '1.2rem', fontSize: '1rem', opacity: 0.5, cursor: 'not-allowed' }}
                >
                  Fill all fields to Pay
                </button>
              )}
            </form>
          </div>

          <div className="order-summary" style={{ background: '#f9f9f9', padding: '3rem', borderRadius: '8px', height: 'fit-content' }}>
            <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.5rem', marginBottom: '2rem' }}>Order Summary</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
              {cartItems.map(item => (
                <div key={item._id} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <div style={{ position: 'relative' }}>
                    <img src={item.image} alt={item.name} style={{ width: '60px', height: '75px', objectFit: 'cover', borderRadius: '4px' }} />
                    <span style={{ position: 'absolute', top: '-10px', right: '-10px', background: '#666', color: '#fff', width: '20px', height: '20px', borderRadius: '50%', fontSize: '0.7rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{item.quantity || 1}</span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '0.9rem', fontWeight: '500' }}>{item.name}</p>
                    <p style={{ fontSize: '0.8rem', color: '#888' }}>{item.category}</p>
                  </div>
                  <p style={{ fontSize: '0.9rem', fontWeight: '600' }}>${item.price * (item.quantity || 1)}</p>
                </div>
              ))}
            </div>
            <div style={{ borderTop: '1px solid #ddd', paddingTop: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: '#666' }}>
                <span>Subtotal</span>
                <span>${calculateTotal()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', color: '#666' }}>
                <span>Shipping</span>
                <span style={{ color: '#27ae60' }}>Free</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '600', fontSize: '1.2rem' }}>
                <span>Total</span>
                <span>${calculateTotal()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default Checkout;
