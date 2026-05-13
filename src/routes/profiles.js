const express = require('express');
const db = require('../db/database');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Get all profiles
router.get('/', (req, res) => {
  db.all('SELECT * FROM profiles', (err, profiles) => {
    if (err) {
      return res.status(500).json({ error: 'Error fetching profiles' });
    }
    res.json(profiles);
  });
});

// Get user profile
router.get('/me', authMiddleware, (req, res) => {
  db.get('SELECT * FROM profiles WHERE user_id = ?', [req.userId], (err, profile) => {
    if (err) {
      return res.status(500).json({ error: 'Error fetching profile' });
    }
    res.json(profile || {});
  });
});

// Get profile by ID
router.get('/:id', (req, res) => {
  db.get('SELECT * FROM profiles WHERE id = ?', [req.params.id], (err, profile) => {
    if (err) {
      return res.status(500).json({ error: 'Error fetching profile' });
    }
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    res.json(profile);
  });
});

// Update profile
router.put('/:id', authMiddleware, (req, res) => {
  const { name, age, bio, gender, location, interests, photo_url } = req.body;

  db.run(
    'UPDATE profiles SET name = ?, age = ?, bio = ?, gender = ?, location = ?, interests = ?, photo_url = ? WHERE user_id = ?',
    [name, age, bio, gender, location, interests, photo_url, req.userId],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Error updating profile' });
      }
      res.json({ message: 'Profile updated successfully' });
    }
  );
});

module.exports = router;
