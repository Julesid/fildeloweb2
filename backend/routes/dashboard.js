const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth');

// Route Dashboard protégée
router.get('/dashboard', authenticate, (req, res) => {
  res.json({ message: 'Bienvenue sur votre Dashboard !' });
});

module.exports = router;
