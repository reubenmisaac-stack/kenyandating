const express = require('express');
const db = require('../db/database');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Get all matches for user
router.get('/', authMiddleware, (req, res) => {
  db.all(
    'SELECT * FROM matches WHERE user_id_1 = ? OR user_id_2 = ?',
    [req.userId, req.userId],
    (err, matches) => {
      if (err) {
        return res.status(500).json({ error: 'Error fetching matches' });
      }
      res.json(matches);
    }
  );
});

// Like a profile
router.post('/like/:profileId', authMiddleware, (req, res) => {
  const { profileId } = req.params;

  db.get('SELECT user_id FROM profiles WHERE id = ?', [profileId], (err, profile) => {
    if (err || !profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    const userId2 = profile.user_id;

    db.run(
      'INSERT INTO matches (user_id_1, user_id_2, status) VALUES (?, ?, ?)',
      [req.userId, userId2, 'liked'],
      function(err) {
        if (err) {
          return res.status(400).json({ error: 'Error creating match' });
        }
        res.status(201).json({ message: 'Profile liked', matchId: this.lastID });
      }
    );
  });
});

// Accept a match
router.put('/:matchId/accept', authMiddleware, (req, res) => {
  db.run(
    'UPDATE matches SET status = ? WHERE id = ?',
    ['matched', req.params.matchId],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Error accepting match' });
      }
      res.json({ message: 'Match accepted' });
    }
  );
});

module.exports = router;
