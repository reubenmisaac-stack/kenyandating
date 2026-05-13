const express = require('express');
const db = require('../db/database');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Get messages with a user
router.get('/:userId', authMiddleware, (req, res) => {
  const { userId } = req.params;

  db.all(
    'SELECT * FROM messages WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?) ORDER BY created_at ASC',
    [req.userId, userId, userId, req.userId],
    (err, messages) => {
      if (err) {
        return res.status(500).json({ error: 'Error fetching messages' });
      }
      res.json(messages);
    }
  );
});

// Send message
router.post('/', authMiddleware, (req, res) => {
  const { receiver_id, message } = req.body;

  if (!receiver_id || !message) {
    return res.status(400).json({ error: 'Receiver ID and message are required' });
  }

  db.run(
    'INSERT INTO messages (sender_id, receiver_id, message) VALUES (?, ?, ?)',
    [req.userId, receiver_id, message],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Error sending message' });
      }
      res.status(201).json({ message: 'Message sent', messageId: this.lastID });
    }
  );
});

// Mark message as read
router.put('/:messageId/read', authMiddleware, (req, res) => {
  db.run(
    'UPDATE messages SET read = 1 WHERE id = ?',
    [req.params.messageId],
    (err) => {
      if (err) {
        return res.status(500).json({ error: 'Error marking message as read' });
      }
      res.json({ message: 'Message marked as read' });
    }
  );
});

module.exports = router;
