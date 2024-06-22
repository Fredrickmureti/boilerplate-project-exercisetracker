/*const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const logSchema = new Schema({
  username: {
    type: String,
    ref: 'User'
  },
  count: {
    type: Number,
    required: true,
    default: 0 // count is used to keep track of number of exercises and when the user logs in an exercise we increment the count
  },
  _id: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  log: [{
    description: {
      type: String,
      required: true
    },
    duration: {
      type: Number,
      required: true
    },
    date: {
      type: Date,
      default: Date.now()
    }
  }]
}, {
  versionKey: false
});

const Log = mongoose.model('Log', logSchema);

module.exports = Log;*/


router.get('/:_id/logs', async (req, res) => {
  try {
    const { _id } = req.params; //extract the id from the request params
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
