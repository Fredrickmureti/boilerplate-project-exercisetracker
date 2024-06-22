const express = require("express");
const mongoose = require('mongoose');
const router = express.Router();
const User = require('../models/user');
const Exercise = require('../models/exercise');

// Add a new exercise
router.post('/:_id/exercises', async (req, res) => {
  try {
    const { _id } = req.params; // extract the id from the request params
    const { description, duration, date } = req.body; //extract the decsription, duration and date from the request body

    //validate the _id
    if (!mongoose.Types.ObjectId.isValid(_id)) { }

    // Check if the user exists
    const user = await User.findById(_id);
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

    //get the id from the request params
    const { _id } = req.params;
    const { from, to, limit } = req.query;

    //validate the id
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return res.status(400).json({ error: 'Invalid ID format' })
    }

    //if the id is valid check if the user exists
    const user = await User.findById(_id);
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    //construct the query object
    let query = { userId: _id };

    //apply date filters if provided
    if (from || to) {
      query.date = {};
      if (from) {
        query.date.$gte = new Date(from); //include entries from this date onwards
      } if (to) {
        query.date.$lte = new Date(to); // include entries up to this date
      }

    }

    //execute the query with an option limit
    const exercises = await Exercise.find(query).limit(parseInt(limit) || 0).exec();

    //format the response
    const log = exercises.map(ex => ({
      description: ex.description,
      duration: ex.duration,
      date: ex.date.toDateString()
    }));

    res.json({
      username: user.username,
      count: exercises.length,
      log
    })
  } catch (err) {
    res.status(400).json({ error: err.message });

  }
})

module.exports = router;