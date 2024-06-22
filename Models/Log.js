const mongoose = require('mongoose');
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

module.exports = Log;