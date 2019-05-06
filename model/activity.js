const mongoose = require('mongoose')

const activity = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content:{
    type: String,
    required: true
  },
  publishUser:{
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'wxUser',
    required: true
  },
  attendUsers: [
    {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'wxUser',
    }
  ],
  reqlies: [
    {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'comment',
    }
  ],
  votes: [
    {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'vote',
    }
  ],
  scheduleType: {
    type: Number,
    default: 0
  },
  schedule: {
    type: Array,
    default: []
  }
},{versionKey: false, timestamps: {createdAt: 'create_time',updatedAt: 'update_time'}})

module.exports = mongoose.model('activity', activity)