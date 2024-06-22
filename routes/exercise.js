const express = require("express");
const mongoose = require('mongoose');
const router = express.Router();
const User = require('../models/user');
const Exercise = require('../models/exercise');

// Add a new exercise
router.post('/:_id/exercises', async (req, res) => {
  try {
    const { userId } = req.params; // extract the id from the request params
    const { description, duration, date } = req.body; //extract the decsription, duration and date from the request body

    //validate the _id
    if (!mongoose.Types.ObjectId.isValid(userId)) { }

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    // Create new exercise entry if the user exists
    const newExercise = new Exercise({
      userId: user._id, // access the user id from the user object
      description: description,
      duration: duration,
      date: date ? new Date(date) : new Date()
    });

    const savedExercise = await newExercise.save();

    res.json({
      _id: _id,
      username: user.username,
      description: savedExercise.description,
      duration: savedExercise.duration,
      date: savedExercise.date.toDateString()
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get user logs
router.get('/:_id/logs', async (req, res) => {
  try {
    const { _id } = req.params;
    const { from, to, limit } = req.query;

    // Check if the user exists
    const user = await User.findById(_id);
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    let query = { userId: _id };

    if (from || to) {
      query.date = {};
      if (from) {
        query.date.$gte = new Date(from);
      }
      if (to) {
        query.date.$lte = new Date(to);
      }
    }

    const exercises = await Exercise.find(query).limit(parseInt(limit) || 0).exec();

    const log = exercises.map(ex => ({
      description: ex.description,
      duration: ex.duration,
      date: ex.date.toDateString() // Properly format the date string
    }));

    res.json({
      _id: user._id,
      username: user.username,
      count: exercises.length,
      log
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;