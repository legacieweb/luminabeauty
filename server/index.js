const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Product Schema
const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  description: String,
  image: String,
  category: String,
  stock: { type: Number, default: 0 }
});

const Product = mongoose.model('Product', productSchema);

// Notification Request Schema
const notificationRequestSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  userEmail: String,
  userName: String,
  date: { type: Date, default: Date.now },
  status: { type: String, enum: ['pending', 'sent'], default: 'pending' }
});

const NotificationRequest = mongoose.model('NotificationRequest', notificationRequestSchema);

// Contact Schema
const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
  date: { type: Date, default: Date.now },
});

const Contact = mongoose.model('Contact', contactSchema);

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  status: { type: String, enum: ['active', 'suspended'], default: 'active' },
  addresses: [{
    street: String,
    city: String,
    state: String,
    zip: String,
    country: String,
    isDefault: { type: Boolean, default: false }
  }],
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// Order Schema
const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false }, // optional for guest checkout if allowed, but we have user tracking
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: String,
    price: Number,
    quantity: Number,
    image: String
  }],
  shippingDetails: {
    firstName: String,
    lastName: String,
    email: String,
    address: String,
    city: String,
    postalCode: String,
    country: String
  },
  total: Number,
  paymentReference: String,
  status: { type: String, enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', orderSchema);

// Middleware
const auth = async (req, res, next) => {
  const token = req.header('x-auth-token');
  
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    // Check if user is suspended
    if (decoded.id !== 'admin') {
      const user = await User.findById(decoded.id);
      if (user && user.status === 'suspended') {
        return res.status(403).json({ message: 'Account suspended' });
      }
    }
    
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

const admin = (req, res, next) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });
  next();
};

// Nodemailer Transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Helper function to send emails
const sendEmail = async (to, subject, text, html) => {
  try {
    const mailOptions = {
      from: `"Lumina Luxury" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html
    };
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error('Email sending failed:', error);
  }
};

// Routes
app.get('/api/ping', (req, res) => res.send('pong'));

// Address Management Routes
app.get('/api/users/addresses', auth, async (req, res) => {
  try {
    if (req.user.id === 'admin') return res.json([]);
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user.addresses || []);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/users/addresses', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    const newAddress = { ...req.body };
    if (newAddress.isDefault) {
      user.addresses.forEach(a => a.isDefault = false);
    } else if (user.addresses.length === 0) {
      newAddress.isDefault = true;
    }
    
    user.addresses.push(newAddress);
    await user.save();
    res.status(201).json(user.addresses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.put('/api/users/addresses/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    const addrIndex = user.addresses.findIndex(a => a._id.toString() === req.params.id);
    if (addrIndex === -1) return res.status(404).json({ message: 'Address not found' });
    
    if (req.body.isDefault) {
      user.addresses.forEach(a => a.isDefault = false);
    }
    
    user.addresses[addrIndex] = { ...user.addresses[addrIndex].toObject(), ...req.body };
    await user.save();
    res.json(user.addresses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.delete('/api/users/addresses/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    user.addresses = user.addresses.filter(a => a._id.toString() !== req.params.id);
    await user.save();
    res.json(user.addresses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({ name, email, password: hashedPassword });
    await user.save();

    // Send Welcome Email
    const welcomeHtml = `
      <div style="font-family: 'Playfair Display', serif; color: #1a1a1a; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e5e5;">
        <h1 style="text-align: center; color: #c5a059;">Welcome to LUMINA</h1>
        <p>Dear ${name},</p>
        <p>Thank you for joining our exclusive community of beauty enthusiasts. Your account has been successfully created.</p>
        <p>You can now explore our curated collection of luxury skincare, makeup, and fragrances.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="http://localhost:5173/login" style="background: #1a1a1a; color: white; padding: 12px 25px; text-decoration: none; border-radius: 4px;">Start Your Ritual</a>
        </div>
        <p>If you have any questions, our concierge team is always here to assist you.</p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 12px; color: #666; text-align: center;">&copy; 2026 LUMINA Luxury Beauty. All rights reserved.</p>
      </div>
    `;
    await sendEmail(email, 'Welcome to Lumina Luxury', `Welcome ${name}! Your account has been created.`, welcomeHtml);

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    // Check if it's the admin from .env
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      const token = jwt.sign({ id: 'admin', role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1h' });
      
      // Notify Admin
      await sendEmail(process.env.ADMIN_EMAIL, 'Admin Login Notification', 'The admin account has been accessed.', `<div style="padding:20px; border:1px solid #c5a059;"><h2>Admin Access Granted</h2><p>The system administrator account was accessed on ${new Date().toLocaleString()}</p></div>`);

      return res.json({ token, user: { id: 'admin', name: 'System Admin', email: process.env.ADMIN_EMAIL, role: 'admin' } });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Send Login Notification
    const loginHtml = `
      <div style="font-family: sans-serif; color: #1a1a1a; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e5e5;">
        <h2 style="color: #c5a059;">Security Alert: New Login</h2>
        <p>Hello ${user.name},</p>
        <p>A new login was detected for your LUMINA account on ${new Date().toLocaleString()}.</p>
        <p>If this was you, you can safely ignore this message. If you did not authorize this login, please contact our support team immediately or reset your password.</p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 12px; color: #666; text-align: center;">Lumina Luxury Beauty Security Team</p>
      </div>
    `;
    await sendEmail(user.email, 'New Login Detected - Lumina Luxury', `A new login was detected on your account.`, loginHtml);

    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/api/products', async (req, res) => {
  try {
    res.setHeader('Cache-Control', 'no-store');
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;

  try {
    // Save to MongoDB
    const newContact = new Contact({ name, email, message });
    await newContact.save();

    // Send Email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: email,
      to: process.env.EMAIL_USER,
      subject: `New Contact from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    };

    // Note: This will only work if EMAIL_USER and EMAIL_PASS are correctly configured
    // For now, we'll just log that we would send an email
    console.log('Would send email to:', process.env.EMAIL_USER);
    // await transporter.sendMail(mailOptions);

    res.status(201).json({ message: 'Message sent successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    res.setHeader('Cache-Control', 'no-store');
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin Product Management
app.post('/api/products', auth, admin, async (req, res) => {
  const { name, price, description, image, category, stock } = req.body;
  try {
    const newProduct = new Product({ name, price, description, image, category, stock: stock || 0 });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.put('/api/products/:id', auth, admin, async (req, res) => {
  try {
    const oldProduct = await Product.findById(req.params.id);
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    
    // Check if stock was increased from 0 to > 0
    if (oldProduct.stock === 0 && updatedProduct.stock > 0) {
      // Notify users who requested notification
      const requests = await NotificationRequest.find({ productId: updatedProduct._id, status: 'pending' });
      
      for (const request of requests) {
        const notifyHtml = `
          <div style="font-family: 'Playfair Display', serif; color: #1a1a1a; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e5e5;">
            <h1 style="text-align: center; color: #c5a059;">Back In Stock!</h1>
            <p>Dear ${request.userName},</p>
            <p>The product you were waiting for is now back in stock: <strong>${updatedProduct.name}</strong></p>
            <div style="text-align: center; margin: 30px 0;">
              <img src="${updatedProduct.image}" alt="${updatedProduct.name}" style="width: 200px; border-radius: 8px; margin-bottom: 20px;">
              <br>
              <a href="http://localhost:5173/product/${updatedProduct._id}" style="background: #1a1a1a; color: white; padding: 12px 25px; text-decoration: none; border-radius: 4px;">Shop Now</a>
            </div>
            <p>Don't miss out - stock is limited!</p>
            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="font-size: 12px; color: #666; text-align: center;">&copy; 2026 LUMINA Luxury Beauty. All rights reserved.</p>
          </div>
        `;
        await sendEmail(request.userEmail, `Back in Stock: ${updatedProduct.name}`, `${updatedProduct.name} is now available at Lumina Luxury!`, notifyHtml);
        request.status = 'sent';
        await request.save();
      }
    }

    res.json(updatedProduct);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin User Overview
app.get('/api/users', auth, admin, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin User Management: Suspend/Activate
app.put('/api/users/:id/status', auth, admin, async (req, res) => {
  const { status } = req.body;
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { status }, { new: true }).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    // Notify User
    const statusHtml = `
      <div style="font-family: 'Playfair Display', serif; color: #1a1a1a; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e5e5;">
        <h1 style="text-align: center; color: #c5a059;">Account Status Update</h1>
        <p>Dear ${user.name},</p>
        <p>Your account status has been updated to: <strong>${status.toUpperCase()}</strong> by the system administrator.</p>
        ${status === 'suspended' ? '<p style="color: #d9534f;">You will no longer be able to access your account or make purchases until the suspension is lifted.</p>' : '<p>You can now access your account and continue your Lumina ritual.</p>'}
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 12px; color: #666; text-align: center;">&copy; 2026 LUMINA Luxury Beauty. All rights reserved.</p>
      </div>
    `;
    await sendEmail(user.email, `Account Status Update: ${status.toUpperCase()}`, `Your account has been ${status}.`, statusHtml);

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin User Management: Send Custom Email
app.post('/api/users/:id/email', auth, admin, async (req, res) => {
  const { subject, message } = req.body;
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    const emailHtml = `
      <div style="font-family: 'Playfair Display', serif; color: #1a1a1a; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e5e5;">
        <h1 style="text-align: center; color: #c5a059;">Message from LUMINA</h1>
        <p>Dear ${user.name},</p>
        <div style="padding: 20px; background: #f9f9f9; border-left: 4px solid #c5a059; margin: 20px 0;">
          ${message.replace(/\n/g, '<br>')}
        </div>
        <p>If you have any questions, our concierge team is always here to assist you.</p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 12px; color: #666; text-align: center;">&copy; 2026 LUMINA Luxury Beauty. All rights reserved.</p>
      </div>
    `;
    await sendEmail(user.email, subject || 'Message from Lumina Luxury', message, emailHtml);

    res.json({ message: 'Email sent successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin User Management: Delete User
app.delete('/api/users/:id', auth, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Notify User before deletion
    const deleteHtml = `
      <div style="font-family: 'Playfair Display', serif; color: #1a1a1a; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e5e5;">
        <h1 style="text-align: center; color: #c5a059;">Account Deletion Notice</h1>
        <p>Dear ${user.name},</p>
        <p>Your LUMINA account has been deleted by the system administrator.</p>
        <p>All your data, including order history and wishlist, has been removed from our system. We are sorry to see you go.</p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 12px; color: #666; text-align: center;">&copy; 2026 LUMINA Luxury Beauty. All rights reserved.</p>
      </div>
    `;
    await sendEmail(user.email, 'Account Deletion Notice', 'Your account has been deleted.', deleteHtml);

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Notification Request
app.post('/api/notifications/request', async (req, res) => {
  const { productId, userEmail, userName } = req.body;
  try {
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const newRequest = new NotificationRequest({ productId, userEmail, userName });
    await newRequest.save();

    // Notify Admin
    const adminHtml = `
      <div style="padding:20px; border:1px solid #c5a059;">
        <h2>Stock Notification Request</h2>
        <p><strong>Product:</strong> ${product.name}</p>
        <p><strong>User:</strong> ${userName} (${userEmail})</p>
        <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
      </div>
    `;
    await sendEmail(process.env.ADMIN_EMAIL, 'New Stock Notification Request', `User ${userName} requested notification for ${product.name}`, adminHtml);

    res.status(201).json(newRequest);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all notifications (Admin)
app.get('/api/notifications', auth, admin, async (req, res) => {
  try {
    const notifications = await NotificationRequest.find().populate('productId').sort({ date: -1 });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get user notifications
app.get('/api/notifications/user/:email', auth, async (req, res) => {
  try {
    const notifications = await NotificationRequest.find({ userEmail: req.params.email }).populate('productId').sort({ date: -1 });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Order Management Routes

// Get all orders (Admin)
app.get('/api/orders', auth, admin, async (req, res) => {
  try {
    const orders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get user orders
app.get('/api/orders/user', auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update order status (Admin)
app.put('/api/orders/:id/status', auth, admin, async (req, res) => {
  const { status } = req.body;
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true }).populate('user', 'name email');
    if (!order) return res.status(404).json({ message: 'Order not found' });

    // Notify User
    const statusHtml = `
      <div style="font-family: 'Playfair Display', serif; color: #1a1a1a; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e5e5;">
        <h1 style="text-align: center; color: #c5a059;">Order Status Update</h1>
        <p>Dear ${order.shippingDetails.firstName},</p>
        <p>The status of your order <strong>#${order._id.toString().slice(-6).toUpperCase()}</strong> has been updated to: <strong style="color: #c5a059;">${status.toUpperCase()}</strong></p>
        <div style="padding: 20px; background: #f9f9f9; border-radius: 8px; margin: 20px 0;">
          <p><strong>Order ID:</strong> #${order._id}</p>
          <p><strong>Total:</strong> $${order.total}</p>
        </div>
        <p>Thank you for choosing LUMINA Luxury Beauty.</p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 12px; color: #666; text-align: center;">&copy; 2026 LUMINA Luxury Beauty. All rights reserved.</p>
      </div>
    `;
    await sendEmail(order.shippingDetails.email, `Order Status Update: ${status.toUpperCase()}`, `Your order status has been updated to ${status}.`, statusHtml);

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Checkout Endpoint (Create Order and Reduce Stock)
app.post('/api/checkout', async (req, res) => {
  const { items, shippingDetails, total, paymentReference, userId } = req.body;
  try {
    // Create new order
    const newOrder = new Order({
      user: userId && userId !== 'admin' ? userId : null,
      items: items.map(item => ({
        productId: item._id,
        name: item.name,
        price: item.price,
        quantity: item.quantity || 1,
        image: item.image
      })),
      shippingDetails,
      total,
      paymentReference,
      status: 'processing'
    });

    await newOrder.save();

    // Reduce stock and check levels
    for (const item of items) {
      const product = await Product.findById(item._id);
      if (product) {
        const oldStock = product.stock;
        product.stock = Math.max(0, product.stock - (item.quantity || 1));
        await product.save();

        // Check for Low Stock (10) or Out of Stock (0)
        if (product.stock === 0 && oldStock > 0) {
          const outOfStockHtml = `
            <div style="padding:20px; border:2px solid #d9534f; font-family: sans-serif;">
              <h2 style="color: #d9534f;">Critical: Product Out of Stock</h2>
              <p><strong>Product:</strong> ${product.name}</p>
              <p>The product has completely run out of stock. Please replenish as soon as possible.</p>
            </div>
          `;
          await sendEmail(process.env.ADMIN_EMAIL, `URGENT: ${product.name} is Out of Stock`, `${product.name} is now out of stock.`, outOfStockHtml);
        } else if (product.stock <= 10 && oldStock > 10) {
          const lowStockHtml = `
            <div style="padding:20px; border:2px solid #f0ad4e; font-family: sans-serif;">
              <h2 style="color: #f0ad4e;">Warning: Low Stock Alert</h2>
              <p><strong>Product:</strong> ${product.name}</p>
              <p><strong>Current Stock:</strong> ${product.stock}</p>
              <p>This product is running low.</p>
            </div>
          `;
          await sendEmail(process.env.ADMIN_EMAIL, `Alert: ${product.name} Stock is Low (${product.stock})`, `${product.name} stock is low.`, lowStockHtml);
        }
      }
    }

    // Send Confirmation Email to User
    const userOrderHtml = `
      <div style="font-family: 'Playfair Display', serif; color: #1a1a1a; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e5e5;">
        <h1 style="text-align: center; color: #c5a059;">Order Confirmed</h1>
        <p>Dear ${shippingDetails.firstName},</p>
        <p>Thank you for your order! We are preparing your luxury beauty ritual.</p>
        <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Order Summary</h3>
          <p><strong>Order ID:</strong> #${newOrder._id}</p>
          <hr>
          ${newOrder.items.map(item => `
            <div style="display: flex; justify-content: space-between; margin: 10px 0;">
              <span>${item.name} x ${item.quantity}</span>
              <span>$${item.price * item.quantity}</span>
            </div>
          `).join('')}
          <hr>
          <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 1.2rem;">
            <span>Total Paid</span>
            <span>$${total}</span>
          </div>
        </div>
        <p>We will notify you once your order has been shipped.</p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 12px; color: #666; text-align: center;">&copy; 2026 LUMINA Luxury Beauty. All rights reserved.</p>
      </div>
    `;
    await sendEmail(shippingDetails.email, 'Order Confirmation - Lumina Luxury', `Your order #${newOrder._id} has been received.`, userOrderHtml);

    // Send Notification Email to Admin
    const adminOrderHtml = `
      <div style="font-family: sans-serif; padding: 20px; border: 1px solid #c5a059;">
        <h2 style="color: #c5a059;">New Order Received</h2>
        <p><strong>Order ID:</strong> ${newOrder._id}</p>
        <p><strong>Customer:</strong> ${shippingDetails.firstName} ${shippingDetails.lastName} (${shippingDetails.email})</p>
        <p><strong>Total:</strong> $${total}</p>
        <p><strong>Payment Ref:</strong> ${paymentReference}</p>
        <a href="http://localhost:5173/admin" style="display:inline-block; padding:10px 20px; background:#1a1a1a; color:white; text-decoration:none; border-radius:4px;">View in Dashboard</a>
      </div>
    `;
    await sendEmail(process.env.ADMIN_EMAIL, 'New Order Alert', `A new order has been placed by ${shippingDetails.email}`, adminOrderHtml);

    res.status(201).json({ message: 'Order placed successfully', orderId: newOrder._id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.delete('/api/products/:id', auth, admin, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Seed data route (for development)
app.post('/api/seed', async (req, res) => {
  try {
    await Product.deleteMany({});
    const sampleProducts = [
      { name: 'Velvet Rose Lipstick', price: 28, description: 'Long-lasting matte finish with rose extract.', image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=400', category: 'Makeup', stock: 50 },
      { name: 'Radiance Glow Serum', price: 52, description: 'Vitamin C & Hyaluronic acid for a natural glow.', image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=400', category: 'Skincare', stock: 30 },
      { name: 'Deep Hydration Cream', price: 42, description: '24-hour moisture for sensitive skin.', image: 'https://www.fresh.com/on/demandware.static/-/Sites-fresh_master_catalog/default/dw3664ccba/product_images/H00006118_plp.jpg', category: 'Skincare', stock: 0 },
      { name: 'Midnight Jasmine Perfume', price: 85, description: 'A sophisticated floral scent for evenings.', image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=400', category: 'Fragrance', stock: 15 },
      { name: 'Silk Finish Foundation', price: 45, description: 'Flawless coverage that feels like second skin.', image: 'https://andreiaprofessional.com/cdn/shop/files/RefreshSilkFoundation-06BrownSugar_9c020c4f-830a-47bc-91ed-811d194256ac_1080x.png?v=1753786125', category: 'Makeup', stock: 25 },
      { name: 'Organic Argan Oil', price: 35, description: 'Pure cold-pressed oil for hair and body.', image: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?q=80&w=400', category: 'Body Care', stock: 10 },
      { name: 'Charcoal Detox Mask', price: 24, description: 'Deeply cleanses and minimizes pores.', image: 'https://www.beautybyeman.co.uk/cdn/shop/files/s-l1600-2024-07-16T175025.176_713x.webp?v=1721148664', category: 'Skincare', stock: 0 },
      { name: 'Golden Sun Bronzer', price: 32, description: 'Sun-kissed glow without the damage.', image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=400', category: 'Makeup', stock: 20 },
    ];
    await Product.insertMany(sampleProducts);
    res.json({ message: 'Database seeded' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
