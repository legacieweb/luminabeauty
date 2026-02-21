import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2, Edit3, X, Menu, Package, LayoutDashboard, LogOut, Users, Bell, UserX, UserCheck, Mail, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Popup from './Popup';
import '../Dashboard.css';

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activeSection, setActiveSection] = useState('inventory');
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
  const [showModal, setShowModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [emailData, setEmailData] = useState({ subject: '', message: '' });
  const [currentProduct, setCurrentProduct] = useState({
    name: '', price: '', description: '', image: '', category: '', stock: 0
  });
  const [editingId, setEditingId] = useState(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/notifications', {
        headers: { 'x-auth-token': token }
      });
      setNotifications(res.data);
    } catch (err) { 
      console.error(err);
      if (err.response && err.response.status === 401) {
        handleLogout();
      }
    }
  };

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/orders', {
        headers: { 'x-auth-token': token }
      });
      setOrders(res.data);
    } catch (err) { 
      console.error(err);
      if (err.response && err.response.status === 401) {
        handleLogout();
      }
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/orders/${orderId}/status`, { status }, {
        headers: { 'x-auth-token': token }
      });
      fetchOrders();
      showAlert('Status Updated', `Order status changed to ${status}`, 'success');
    } catch (err) { 
      if (err.response && err.response.status === 401) {
        handleLogout();
      } else {
        showAlert('Error', 'Error updating status', 'error');
      }
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/products');
      setProducts(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/users', {
        headers: { 'x-auth-token': token }
      });
      setUsers(res.data);
    } catch (err) { 
      console.error(err);
      if (err.response && err.response.status === 401) {
        handleLogout();
      }
    }
  };

  const updateUserStatus = async (userId, status) => {
    showConfirm(
      'Update User Status',
      `Are you sure you want to ${status === 'suspended' ? 'suspend' : 'activate'} this user?`,
      async () => {
        try {
          const token = localStorage.getItem('token');
          await axios.put(`http://localhost:5000/api/users/${userId}/status`, { status }, {
            headers: { 'x-auth-token': token }
          });
          fetchUsers();
          showAlert('Success', `User has been ${status === 'suspended' ? 'suspended' : 'activated'}.`, 'success');
        } catch (err) { showAlert('Error', 'Error updating status', 'error'); }
      }
    );
  };

  const deleteUser = async (userId) => {
    showConfirm(
      'Delete User',
      'PERMANENT ACTION: Are you sure you want to delete this user? This will also send them a notification email.',
      async () => {
        try {
          const token = localStorage.getItem('token');
          await axios.delete(`http://localhost:5000/api/users/${userId}`, {
            headers: { 'x-auth-token': token }
          });
          fetchUsers();
          showAlert('Deleted', 'User account has been permanently removed.', 'success');
        } catch (err) { showAlert('Error', 'Error deleting user', 'error'); }
      },
      'error'
    );
  };

  const handleSendEmail = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:5000/api/users/${selectedUser._id}/email`, emailData, {
        headers: { 'x-auth-token': token }
      });
      setShowEmailModal(false);
      setEmailData({ subject: '', message: '' });
      showAlert('Email Sent', 'Your message has been delivered to the user.', 'success');
    } catch (err) { showAlert('Error', 'Error sending email', 'error'); }
  };

  useEffect(() => { 
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user'));

      if (!token || !user || user.role !== 'admin') {
        navigate('/login');
        return false;
      }
      return true;
    };

    if (checkAuth()) {
      fetchProducts(); 
      fetchUsers();
      fetchNotifications();
      fetchOrders();
      setLoading(false);
    }
  }, [navigate]);

  if (loading) {
    return (
      <div className="preloader-overlay">
        <div className="loader"></div>
        <p>Verifying admin access...</p>
      </div>
    );
  }

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    const finalValue = type === 'number' ? (value === '' ? '' : parseInt(value) || 0) : value;
    setCurrentProduct({ ...currentProduct, [name]: finalValue });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/api/products/${editingId}`, currentProduct, {
          headers: { 'x-auth-token': token }
        });
      } else {
        await axios.post('http://localhost:5000/api/products', currentProduct, {
          headers: { 'x-auth-token': token }
        });
      }
      setShowModal(false);
      setEditingId(null);
      setCurrentProduct({ name: '', price: '', description: '', image: '', category: '', stock: 0 });
      fetchProducts();
    } catch (err) {
      showAlert('Error', err.response?.data?.message || 'Error saving product', 'error');
    }
  };

  const deleteProduct = async (id) => {
    showConfirm(
      'Remove Product',
      'Are you sure you want to remove this item from inventory?',
      async () => {
        try {
          await axios.delete(`http://localhost:5000/api/products/${id}`, {
            headers: { 'x-auth-token': localStorage.getItem('token') }
          });
          fetchProducts();
          showAlert('Deleted', 'Product has been removed.', 'success');
        } catch (err) { showAlert('Error', 'Error deleting', 'error'); }
      },
      'error'
    );
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
    window.location.reload();
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'inventory':
        return (
          <>
            <header className="content-header admin-header-flex">
              <div>
                <h1>Inventory</h1>
                <p className="breadcrumb">Admin / Product Management</p>
              </div>
            </header>

            <div className="content-card">
              <div className="admin-table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(p => (
                      <tr key={p._id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <img src={p.image} alt="" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                            <span style={{ fontWeight: '500' }}>{p.name}</span>
                          </div>
                        </td>
                        <td><span className="status-tag" style={{ background: '#f0f0f0', color: '#666' }}>{p.category}</span></td>
                        <td><span style={{ fontWeight: '600' }}>${p.price}</span></td>
                        <td>
                          <span className={`status-tag ${p.stock <= 0 ? 'status-cancelled' : p.stock < 10 ? 'status-pending' : 'status-completed'}`} style={{ 
                            background: p.stock <= 0 ? '#fee2e2' : p.stock < 10 ? '#fef3c7' : '#dcfce7',
                            color: p.stock <= 0 ? '#991b1b' : p.stock < 10 ? '#92400e' : '#166534'
                          }}>
                            {p.stock} in stock
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                            <Edit3 size={18} style={{ cursor: 'pointer', color: '#666' }} onClick={() => { setCurrentProduct(p); setEditingId(p._id); setShowModal(true); }} />
                            <Trash2 size={18} style={{ cursor: 'pointer', color: '#d9534f' }} onClick={() => deleteProduct(p._id)} />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        );
      case 'orders':
        return (
          <>
            <header className="content-header admin-header-flex">
              <div>
                <h1>Order Management</h1>
                <p className="breadcrumb">Admin / Customer Orders</p>
              </div>
            </header>
            <div className="content-card">
              <div className="admin-table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Items</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th style={{ textAlign: 'right' }}>Update Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(o => (
                      <tr key={o._id}>
                        <td><span style={{ fontWeight: '600', fontSize: '0.8rem' }}>#{o._id.toString().slice(-6).toUpperCase()}</span></td>
                        <td>
                          <div>
                            <div style={{ fontWeight: '500' }}>{o.shippingDetails?.firstName || 'Guest'} {o.shippingDetails?.lastName || ''}</div>
                            <div style={{ fontSize: '0.8rem', color: '#666' }}>{o.shippingDetails?.email || 'N/A'}</div>
                          </div>
                        </td>
                        <td>
                          <div style={{ fontSize: '0.85rem' }}>
                            {o.items.map((item, idx) => (
                              <div key={idx}>{item.name} x {item.quantity}</div>
                            ))}
                          </div>
                        </td>
                        <td><span style={{ fontWeight: '600' }}>${o.total}</span></td>
                        <td>
                          <span className={`status-tag status-${o.status}`}>
                            {o.status}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <select 
                            value={o.status} 
                            onChange={(e) => updateOrderStatus(o._id, e.target.value)}
                            style={{ padding: '0.4rem', borderRadius: '4px', border: '1px solid #ddd', fontSize: '0.85rem' }}
                          >
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        );
      case 'users':
        return (
          <>
            <header className="content-header admin-header-flex">
              <div>
                <h1>User Overview</h1>
                <p className="breadcrumb">Admin / Registered Users</p>
              </div>
            </header>
            <div className="content-card">
              <div className="admin-table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Status</th>
                      <th>Role</th>
                      <th>Joined Date</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u._id}>
                        <td><span style={{ fontWeight: '500' }}>{u.name}</span></td>
                        <td>{u.email}</td>
                        <td>
                          <span className={`status-tag ${u.status === 'suspended' ? 'status-cancelled' : 'status-completed'}`} style={{ 
                            background: u.status === 'suspended' ? '#fee2e2' : '#dcfce7',
                            color: u.status === 'suspended' ? '#991b1b' : '#166534'
                          }}>
                            {u.status || 'active'}
                          </span>
                        </td>
                        <td><span className="status-tag" style={{ background: u.role === 'admin' ? '#dcfce7' : '#f0f0f0' }}>{u.role}</span></td>
                        <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                            <Mail size={18} title="Send Email" style={{ cursor: 'pointer', color: '#666' }} onClick={() => { setSelectedUser(u); setShowEmailModal(true); }} />
                            {u.role !== 'admin' && (
                              <>
                                {u.status === 'suspended' ? (
                                  <UserCheck size={18} title="Activate User" style={{ cursor: 'pointer', color: '#27ae60' }} onClick={() => updateUserStatus(u._id, 'active')} />
                                ) : (
                                  <UserX size={18} title="Suspend User" style={{ cursor: 'pointer', color: '#f0ad4e' }} onClick={() => updateUserStatus(u._id, 'suspended')} />
                                )}
                                <Trash2 size={18} title="Delete User" style={{ cursor: 'pointer', color: '#d9534f' }} onClick={() => deleteUser(u._id)} />
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        );
      case 'notifications':
        return (
          <>
            <header className="content-header admin-header-flex">
              <div>
                <h1>Restock Requests</h1>
                <p className="breadcrumb">Admin / Notification Requests</p>
              </div>
            </header>
            <div className="content-card">
              <div className="admin-table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>User</th>
                      <th>Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {notifications.map(n => (
                      <tr key={n._id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <img src={n.productId?.image} alt="" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                            <span style={{ fontWeight: '500' }}>{n.productId?.name}</span>
                          </div>
                        </td>
                        <td>
                          <div>
                            <div style={{ fontWeight: '500' }}>{n.userName}</div>
                            <div style={{ fontSize: '0.8rem', color: '#666' }}>{n.userEmail}</div>
                          </div>
                        </td>
                        <td>{new Date(n.date).toLocaleString()}</td>
                        <td>
                          <span className={`status-tag ${n.status === 'sent' ? 'status-completed' : 'status-pending'}`}>
                            {n.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  const handleNavClick = (section) => {
    setActiveSection(section);
    setSidebarOpen(false);
  };

  return (
    <div className="dashboard-wrapper">
      <button className="mobile-hamburger" onClick={() => setSidebarOpen(!sidebarOpen)}>
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)}></div>}

      <div className="dashboard-container">
        <aside className={`dashboard-sidebar-v2 ${sidebarOpen ? 'active' : ''}`}>
          <div className="sidebar-header">
            <div className="user-avatar admin-bg">A</div>
            <div className="user-info-brief">
              <h3>Admin Central</h3>
              <p>Management Portal</p>
            </div>
          </div>
          <nav className="sidebar-nav">
            <button className={`nav-item ${activeSection === 'inventory' ? 'active' : ''}`} onClick={() => handleNavClick('inventory')}>
              <Package size={18} />
              <span>Inventory</span>
            </button>
            <button className={`nav-item ${activeSection === 'orders' ? 'active' : ''}`} onClick={() => handleNavClick('orders')}>
              <ShoppingBag size={18} />
              <span>Order Management</span>
            </button>
            <button className={`nav-item ${activeSection === 'users' ? 'active' : ''}`} onClick={() => handleNavClick('users')}>
              <Users size={18} />
              <span>User Overview</span>
            </button>
            <button className={`nav-item ${activeSection === 'notifications' ? 'active' : ''}`} onClick={() => handleNavClick('notifications')}>
              <Bell size={18} />
              <span>Restock Requests</span>
            </button>
            <button className="nav-item logout-btn" onClick={() => { handleLogout(); setSidebarOpen(false); }}>
              <LogOut size={18} />
              <span>Sign Out</span>
            </button>
          </nav>
        </aside>

        <main className="dashboard-main-content">
          {renderContent()}
        </main>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="auth-card">
            <X size={20} className="lucide-x" onClick={() => setShowModal(false)} />
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.5rem', marginBottom: '1rem' }}>{editingId ? 'Edit Product' : 'Add New Product'}</h2>
            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="input-group-v2">
                <label>Product Name</label>
                <input name="name" value={currentProduct.name} onChange={handleInputChange} placeholder="e.g. Velvet Rose Lipstick" required />
              </div>
              <div className="admin-form-row">
                <div className="input-group-v2">
                  <label>Price ($)</label>
                  <input name="price" type="number" value={currentProduct.price} onChange={handleInputChange} placeholder="28" required />
                </div>
                <div className="input-group-v2">
                  <label>Stock</label>
                  <input name="stock" type="number" value={currentProduct.stock} onChange={handleInputChange} placeholder="100" required />
                </div>
                <div className="input-group-v2">
                  <label>Category</label>
                  <input name="category" value={currentProduct.category} onChange={handleInputChange} placeholder="Makeup" required />
                </div>
              </div>
              <div className="input-group-v2">
                <label>Image URL</label>
                <input name="image" value={currentProduct.image} onChange={handleInputChange} placeholder="https://..." required />
              </div>
              <div className="input-group-v2">
                <label>Description</label>
                <textarea name="description" value={currentProduct.description} onChange={handleInputChange} placeholder="Describe the product..." required />
              </div>
              <button type="submit" className="auth-btn" style={{ marginTop: '1rem' }}>{editingId ? 'Update Product' : 'Create Product'}</button>
            </form>
          </div>
        </div>
      )}
      {showEmailModal && selectedUser && (
        <div className="modal-overlay">
          <div className="auth-card">
            <X size={20} className="lucide-x" onClick={() => setShowEmailModal(false)} />
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.5rem', marginBottom: '1rem' }}>Send Email to {selectedUser.name}</h2>
            <form className="auth-form" onSubmit={handleSendEmail}>
              <div className="input-group-v2">
                <label>Subject</label>
                <input 
                  value={emailData.subject} 
                  onChange={(e) => setEmailData({...emailData, subject: e.target.value})} 
                  placeholder="Subject of your message" 
                  required 
                />
              </div>
              <div className="input-group-v2">
                <label>Message</label>
                <textarea 
                  value={emailData.message} 
                  onChange={(e) => setEmailData({...emailData, message: e.target.value})} 
                  placeholder="Write your message here..." 
                  required 
                />
              </div>
              <button type="submit" className="auth-btn" style={{ marginTop: '1rem' }}>Send Email</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
