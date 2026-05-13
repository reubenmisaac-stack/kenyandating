const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db/database');

const router = express.Router();

// Register
router.post('/register', (req, res) => {
  const { email, password, name, age, gender, location } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ error: 'Email, password, and name are required' });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);

  db.run('INSERT INTO users (email, password) VALUES (?, ?)', [email, hashedPassword], function(err) {
    if (err) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const userId = this.lastID;

    // Create profile
    db.run(
      'INSERT INTO profiles (user_id, name, age, gender, location) VALUES (?, ?, ?, ?, ?)',
      [userId, name, age, gender, location],
      (err) => {
        if (err) {
          return res.status(500).json({ error: 'Error creating profile' });
        }

        const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.status(201).json({ message: 'User registered successfully', token, userId });
      }
    );
  });
});

// Login
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
    if (err || !user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const passwordMatch = bcrypt.compareSync(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ message: 'Login successful', token, userId: user.id });
  });
});

module.exports = router;
