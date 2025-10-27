// routes/users.js or routes/profile.js

const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const authMiddleware = require('../middleware');

const router = express.Router();

router.get('/me', authMiddleware, async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select('-password');
      if (!user) return res.status(404).json({ message: 'User not found' });
      res.json(user);
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  });
  

  router.put('/me', authMiddleware, async (req, res) => {
    const { name, email } = req.body;
  
    try {
      const user = await User.findByIdAndUpdate(
        req.user.id,
        { name, email },
        { new: true, runValidators: true }
      ).select('-password');
  
      if (!user) return res.status(404).json({ message: 'User not found' });
  
      res.json(user);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to update profile' });
    }
  });


router.put('/me/password', authMiddleware, async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Incorrect current password' });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error('Password update error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
