const express = require('express');
const router = express.Router();
const User = require('../Models/User');
const Log = require('../Models/Log');


router.get('/:_id/logs', async (req, res) => {
  try {
    const { _id } = req.params;

    // Check if the user exists
    const user = await User.findById(_id);
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    // Return user object with exercise log
    res.json({
      _id: user._id,
      username: user.username,
      count: user.log.length,
      log: user.log.map((exercise) => ({
        description: exercise.description,
        duration: exercise.duration,
        date: new Date(exercise.date).toDateString() // Format date as required
      }))
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
