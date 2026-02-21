const jwt = require('jsonwebtoken');
require('dotenv').config();

const secret = process.env.JWT_SECRET;
console.log('Secret from .env:', secret);

const token = jwt.sign({ id: 'admin', role: 'admin' }, secret, { expiresIn: '1h' });
console.log('Generated token:', token);

try {
  const decoded = jwt.verify(token, secret);
  console.log('Verification success:', decoded);
} catch (err) {
  console.error('Verification failed:', err.message);
}
