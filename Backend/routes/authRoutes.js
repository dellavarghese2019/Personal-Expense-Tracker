const express = require('express');
const User = require('../models/userModel'); 
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const {registerUser} = require('../controllers/authController')


router.post('/register',registerUser)

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

  
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

res.json({
  token,
  user: {
    name: user.name,
    email: user.email
  }
});


    
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
