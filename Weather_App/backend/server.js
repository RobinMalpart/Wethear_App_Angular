const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const app = express();
const SECRET_KEY = 'your_secret_key';

app.use(bodyParser.json());

// Simulated database
const users = [
  { id: 1, username: 'johndoe', password: 'password123' }
];

// Login route
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (user) {
    const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// Signup route
app.post('/signup', (req, res) => {
  const { username, password } = req.body;
  const userExists = users.some(u => u.username === username);
  if (userExists) {
    res.status(409).json({ message: 'Username already exists' });
  } else {
    const newUser = { id: users.length + 1, username, password };
    users.push(newUser);
    const token = jwt.sign({ id: newUser.id, username: newUser.username }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token });
  }
});

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).json({ message: 'No token provided' });
  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(500).json({ message: 'Failed to authenticate token' });
    req.userId = decoded.id;
    next();
  });
};

// Protected route example
app.get('/protected', verifyToken, (req, res) => {
  res.json({ message: 'This is a protected route', userId: req.userId });
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});