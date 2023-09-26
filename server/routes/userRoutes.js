// userRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/userModel'); // Import the User model

// Create a new user
router.post('/', async (req, res) => {
  
  try { console.log(req.body)
    const newUser = new User({ name:req.body.name }); 
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Retrieve a user by ID
router.get('/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findOne({ userId });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('Error retrieving user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
