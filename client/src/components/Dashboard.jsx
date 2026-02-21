import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, ShoppingBag, Settings, LogOut, ChevronRight, Heart, MapPin, Bell, Star, ShieldCheck, Plus, X, Menu, LayoutDashboard } from 'lucide-react';
import axios from 'axios';
import Popup from './Popup';
import '../Dashboard.css';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const showAlert = (title, message, type = 'info') => {
    window.dispatchEvent(new CustomEvent('showPopup', { 
      detail: { title, message, type } 
    }));
  };

  const showConfirm = (title, message, onConfirm, type = 'warning') => {
    window.dispatchEvent(new CustomEvent('showPopup', { 
      detail: { title, message, type, showConfirm: true, onConfirm } 
    }));
  };
  const [orders, setOrders] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [showAddrModal, setShowAddrModal] = useState(false);
  const [editingAddrId, setEditingAddrId] = useState(null);
  const [addrForm, setAddrForm] = useState({
    street: '', city: '', state: '', zip: '', country: '', isDefault: false
  });
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
    } else {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      
      // Load orders from backend
      fetchUserOrders();

      // Load wishlist
      const storedWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
      setWishlist(storedWishlist.slice(0, 3)); // Only show top 3 in dashboard

      // Fetch recommendations
      axios.get('http://localhost:5000/api/products')
        .then(res => {
          setRecommendations(res.data.sort(() => 0.5 - Math.random()).slice(0, 3));
        })
        .catch(err => console.error(err));

      // Fetch addresses
      fetchAddresses();

      // Fetch user notifications
      fetchNotifications(parsedUser.email);
    }
  }, [navigate]);

  const fetchUserOrders = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get('http://localhost:5000/api/orders/user', {
        headers: { 'x-auth-token': token }
      });
      setOrders(res.data);
    } catch (err) { 
      console.error('Error fetching orders:', err); 
      if (err.response && err.response.status === 401) {
        handleLogout();
      }
    }
  };

  const fetchAddresses = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get('http://localhost:5000/api/users/addresses', {
        headers: { 'x-auth-token': token }
      });
      setAddresses(res.data);
    } catch (err) { 
      console.error('Error fetching addresses:', err); 
      if (err.response && err.response.status === 401) {
        handleLogout();
      }
    }
  };

  const fetchNotifications = async (email) => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get(`http://localhost:5000/api/notifications/user/${email}`, {
        headers: { 'x-auth-token': token }
      });
      setNotifications(res.data);
    } catch (err) { 
      console.error('Error fetching notifications:', err); 
      if (err.response && err.response.status === 401) {
        handleLogout();
      }
    }
  };

  const handleAddrSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      if (editingAddrId) {
        await axios.put(`http://localhost:5000/api/users/addresses/${editingAddrId}`, addrForm, {
          headers: { 'x-auth-token': token }
        });
      } else {
        await axios.post('http://localhost:5000/api/users/addresses', addrForm, {
          headers: { 'x-auth-token': token }
        });
      }
      setShowAddrModal(false);
      setEditingAddrId(null);
      setAddrForm({ street: '', city: '', state: '', zip: '', country: '', isDefault: false });
      fetchAddresses();
    } catch (err) { showAlert('Error', 'Error saving address', 'error'); }
  };

  const deleteAddress = async (id) => {
    showConfirm(
      'Remove Address',
      'Are you sure you want to remove this shipping address?',
      async () => {
        const token = localStorage.getItem('token');
        try {
          await axios.delete(`http://localhost:5000/api/users/addresses/${id}`, {
            headers: { 'x-auth-token': token }
          });
          fetchAddresses();
          showAlert('Removed', 'Address has been deleted.', 'success');
        } catch (err) { showAlert('Error', 'Error deleting address', 'error'); }
      }
    );
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
    window.location.reload();
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setSidebarOpen(false);
  };

  if (!user) return null;

  return (
    <div className="dashboard-wrapper">
      <button className="mobile-hamburger" onClick={() => setSidebarOpen(!sidebarOpen)}>
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)}></div>}

      <div className="dashboard-container">
        <aside className={`dashboard-sidebar-v2 ${sidebarOpen ? 'active' : ''}`}>
          <div className="sidebar-header">
            <div className="user-avatar">
              {user.name.charAt(0)}
            </div>
            <div className="user-info-brief">
              <h3>{user.name}</h3>
              <p>{user.email}</p>
            </div>
          </div>

          <nav className="sidebar-nav">
            <button 
              className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => handleTabClick('overview')}
            >
              <LayoutDashboard size={18} />
              <span>Overview</span>
              <ChevronRight size={14} className="chevron" />
            </button>
            <button 
              className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => handleTabClick('profile')}
            >
              <User size={18} />
              <span>Profile Settings</span>
              <ChevronRight size={14} className="chevron" />
            </button>
            <button 
              className={`nav-item ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => handleTabClick('orders')}
            >
              <ShoppingBag size={18} />
              <span>My Orders</span>
              <ChevronRight size={14} className="chevron" />
            </button>
            <button 
              className={`nav-item ${activeTab === 'addresses' ? 'active' : ''}`}
              onClick={() => handleTabClick('addresses')}
            >
              <MapPin size={18} />
              <span>Addresses</span>
              <ChevronRight size={14} className="chevron" />
            </button>
            <button 
              className={`nav-item ${activeTab === 'restock' ? 'active' : ''}`}
              onClick={() => handleTabClick('restock')}
            >
              <Bell size={18} />
              <span>Restock Requests</span>
              <ChevronRight size={14} className="chevron" />
            </button>
            {user.role === 'admin' && (
              <button 
                className="nav-item admin-link"
                onClick={() => { navigate('/admin'); setSidebarOpen(false); }}
              >
                <Settings size={18} />
                <span>Admin Panel</span>
                <ChevronRight size={14} className="chevron" />
              </button>
            )}
            <button className="nav-item logout-btn" onClick={() => { handleLogout(); setSidebarOpen(false); }}>
              <LogOut size={18} />
              <span>Sign Out</span>
            </button>
          </nav>
        </aside>

        <main className="dashboard-main-content">
          <header className="content-header">
            <h1>Welcome, {user.name.split(' ')[0]}</h1>
            <p className="breadcrumb">Lumina Exclusive / {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</p>
          </header>

          {activeTab === 'overview' && (
            <div className="overview-grid">
              <div className="stats-row">
                <div className="stat-card">
                  <ShoppingBag className="stat-icon" />
                  <div className="stat-content">
                    <span className="stat-label">Total Orders</span>
                    <span className="stat-value">{orders.length}</span>
                  </div>
                </div>
                <div className="stat-card">
                  <Heart className="stat-icon" />
                  <div className="stat-content">
                    <span className="stat-label">Wishlist Items</span>
                    <span className="stat-value">{wishlist.length}</span>
                  </div>
                </div>
                <div className="stat-card">
                  <ShieldCheck className="stat-icon" />
                  <div className="stat-content">
                    <span className="stat-label">Membership</span>
                    <span className="stat-value">Elite</span>
                  </div>
                </div>
              </div>

              <div className="dashboard-section-split">
                <div className="recent-orders-mini content-card">
                  <div className="section-header">
                    <h3>Recent Activity</h3>
                    <button onClick={() => setActiveTab('orders')}>View All</button>
                  </div>
                  {orders.length > 0 ? (
                    <div className="mini-order-list">
                      {orders.slice(0, 2).map((order, i) => (
                        <div key={i} className="mini-order-item">
                          <div className="order-dot"></div>
                          <div className="mini-order-info">
                            <p className="order-summary">Order #{order._id.toString().slice(-6).toUpperCase()}</p>
                            <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                          </div>
                          <span className="mini-order-price">${order.total}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="empty-mini">No recent orders found.</p>
                  )}
                </div>

                <div className="wishlist-mini content-card">
                  <div className="section-header">
                    <h3>My Wishlist</h3>
                    <button onClick={() => navigate('/wishlist')}>Manage</button>
                  </div>
                  {wishlist.length > 0 ? (
                    <div className="mini-product-grid">
                      {wishlist.map((item, i) => (
                        <div key={i} className="mini-product-item" onClick={() => navigate(`/product/${item._id}`)}>
                          <img src={item.image} alt={item.name} />
                          <div className="mini-product-details">
                            <p>{item.name}</p>
                            <span>${item.price}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="empty-mini">Your wishlist is empty.</p>
                  )}
                </div>
              </div>

              <div className="recommendations-section content-card">
                <h3>Recommended for You</h3>
                <div className="recommendations-grid">
                  {recommendations.map((prod, i) => (
                    <div key={i} className="recommendation-card" onClick={() => navigate(`/product/${prod._id}`)}>
                      <div className="rec-image">
                        <img src={prod.image} alt={prod.name} />
                        <span className="rec-tag">Essential</span>
                      </div>
                      <div className="rec-info">
                        <h4>{prod.name}</h4>
                        <div className="rec-meta">
                          <span>{prod.category}</span>
                          <p>${prod.price}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="content-card">
              <div className="profile-section">
                <div className="section-grid">
                  <div className="input-group-v2">
                    <label>Full Name</label>
                    <div className="value-display">{user.name}</div>
                  </div>
                  <div className="input-group-v2">
                    <label>Email Address</label>
                    <div className="value-display">{user.email}</div>
                  </div>
                  <div className="input-group-v2">
                    <label>Account Status</label>
                    <div className="value-display status">
                      <span className="status-dot"></span>
                      Verified {user.role === 'admin' ? 'Administrator' : 'Exclusive Member'}
                    </div>
                  </div>
                  <div className="input-group-v2">
                    <label>Joined Since</label>
                    <div className="value-display">February 2026</div>
                  </div>
                </div>
                
                <div className="profile-footer">
                  <button className="btn-edit">Update Details</button>
                  <button className="btn-password">Secure Password</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="content-card">
              <div className="orders-section">
                {orders.length > 0 ? (
                  <div className="orders-list">
                    {orders.map((order, idx) => (
                      <div key={idx} className="order-row">
                        <div className="order-meta">
                          <span className="order-id">#{order._id.toString().slice(-6).toUpperCase()}</span>
                          <span className="order-date">{new Date(order.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="order-items-summary">
                          {order.items.map((item, i) => (
                            <span key={i}>{item.name} (x{item.quantity || 1})</span>
                          ))}
                        </div>
                        <div className="order-status-price">
                          <span className="price">${order.total}</span>
                          <span className={`status-tag status-${order.status}`}>{order.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-state">
                    <ShoppingBag size={48} />
                    <p>Your order history is a blank canvas.</p>
                    <button onClick={() => navigate('/')} className="btn-shop">Explore Collection</button>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'addresses' && (
            <div className="address-section">
              <div className="section-header" style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontFamily: 'Playfair Display, serif' }}>Shipping Addresses</h2>
                <button 
                  className="auth-btn" 
                  style={{ width: 'auto', padding: '0.8rem 1.5rem' }}
                  onClick={() => {
                    setEditingAddrId(null);
                    setAddrForm({ street: '', city: '', state: '', zip: '', country: '', isDefault: false });
                    setShowAddrModal(true);
                  }}
                >
                  <Plus size={18} /> Add New
                </button>
              </div>
              <div className="address-grid">
                {addresses.map((addr) => (
                  <div key={addr._id} className={`address-card ${addr.isDefault ? 'active' : ''}`}>
                    <div className="address-header">
                      <h4>{addr.city}</h4>
                      {addr.isDefault && <span className="default-tag">Default</span>}
                    </div>
                    <p>{user.name}</p>
                    <p>{addr.street}</p>
                    <p>{addr.city}, {addr.state} {addr.zip}</p>
                    <p>{addr.country}</p>
                    <div className="address-actions">
                      <button onClick={() => {
                        setEditingAddrId(addr._id);
                        setAddrForm(addr);
                        setShowAddrModal(true);
                      }}>Edit</button>
                      <button onClick={() => deleteAddress(addr._id)}>Remove</button>
                    </div>
                  </div>
                ))}
                {addresses.length === 0 && (
                  <div className="address-card add-new" onClick={() => setShowAddrModal(true)}>
                    <Plus size={24} />
                    <span>Add New Address</span>
                  </div>
                )}
              </div>
            </div>
          )}
          {activeTab === 'restock' && (
            <div className="content-card">
              <div className="orders-section">
                <h2 style={{ fontFamily: 'Playfair Display, serif', marginBottom: '1.5rem' }}>Your Stock Notifications</h2>
                {notifications.length > 0 ? (
                  <div className="orders-list">
                    {notifications.map((notif, idx) => (
                      <div key={idx} className="order-row">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flex: 1 }}>
                          <img src={notif.productId?.image} alt="" style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px' }} />
                          <div>
                            <span style={{ fontWeight: '600', display: 'block' }}>{notif.productId?.name}</span>
                            <span style={{ fontSize: '0.85rem', color: '#666' }}>Requested on {new Date(notif.date).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="order-status-price">
                          <span className={`status-tag ${notif.status === 'sent' ? 'status-completed' : 'status-pending'}`}>
                            {notif.status === 'sent' ? 'Notification Sent' : 'Awaiting Restock'}
                          </span>
                          {notif.status === 'sent' && (
                            <button 
                              onClick={() => navigate(`/product/${notif.productId?._id}`)}
                              style={{ marginLeft: '1rem', padding: '0.4rem 0.8rem', background: '#1a1a1a', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}
                            >
                              Shop Now
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-state">
                    <Bell size={48} />
                    <p>You haven't requested any stock notifications yet.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      {showAddrModal && (
        <div className="modal-overlay">
          <div className="auth-card">
            <X size={20} className="lucide-x" onClick={() => setShowAddrModal(false)} />
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.5rem', marginBottom: '1rem' }}>
              {editingAddrId ? 'Edit Address' : 'New Shipping Address'}
            </h2>
            <form className="auth-form" onSubmit={handleAddrSubmit}>
              <div className="input-group-v2">
                <label>Street Address</label>
                <input 
                  value={addrForm.street} 
                  onChange={(e) => setAddrForm({...addrForm, street: e.target.value})}
                  placeholder="Street and number" required 
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="input-group-v2">
                  <label>City</label>
                  <input 
                    value={addrForm.city} 
                    onChange={(e) => setAddrForm({...addrForm, city: e.target.value})}
                    placeholder="City" required 
                  />
                </div>
                <div className="input-group-v2">
                  <label>State/Province</label>
                  <input 
                    value={addrForm.state} 
                    onChange={(e) => setAddrForm({...addrForm, state: e.target.value})}
                    placeholder="State" required 
                  />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="input-group-v2">
                  <label>ZIP/Postal Code</label>
                  <input 
                    value={addrForm.zip} 
                    onChange={(e) => setAddrForm({...addrForm, zip: e.target.value})}
                    placeholder="Zip" required 
                  />
                </div>
                <div className="input-group-v2">
                  <label>Country</label>
                  <input 
                    value={addrForm.country} 
                    onChange={(e) => setAddrForm({...addrForm, country: e.target.value})}
                    placeholder="Country" required 
                  />
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '1rem 0' }}>
                <input 
                  type="checkbox" 
                  checked={addrForm.isDefault}
                  onChange={(e) => setAddrForm({...addrForm, isDefault: e.target.checked})}
                  id="isDefault"
                />
                <label htmlFor="isDefault" style={{ fontSize: '0.85rem', color: '#666' }}>Set as default address</label>
              </div>
              <button type="submit" className="auth-btn" style={{ marginTop: '1rem' }}>
                {editingAddrId ? 'Update Address' : 'Save Address'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
