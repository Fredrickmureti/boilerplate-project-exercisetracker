const express = require("express");
const router = express.Router();
const User = require('../models/user');

// Create a new user
router.post('/', async (req, res) => {
  try {
    const { username } = req.body; // extract username from request body

    //check if the user exists

    let checkUser = await User.findOne({ username: username });
    if (checkUser) {
      //if the user exists return their username and id
      return res.json({ username: checkUser.username, _id: checkUser._id });
    }

    //if the user does not exist in the database create a new one
    const newUser = new User({ username }); // create new User Model instance
    const savedUser = await newUser.save(); // save the new User
    res.json({ username: savedUser.username, _id: savedUser._id }); // return the saved User together with the id
  } catch (err) {
    res.status(400).json({ error: err.message }); // catch any possible error
  }
});

// Get all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find({}, '_id username');
    res.json(users);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;