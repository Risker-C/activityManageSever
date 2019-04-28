const mongoose = require('mongoose')

const comment = mongoose.Schema({
  activityID: {
    type: mongoose.SchemaTypes.ObjectId,
    required: true
  },
  parentID: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'comment',
    required: false
  },
  commentTo: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'wxUser',
    required: true
  },
  commentUser:{
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'wxUser',
    required: true
  },
  content: {
    type: String,
    required: true,
  }
},{versionKey: false, timestamps: {createdAt: 'create_time', updated: 'update_time'}})

module.exports = mongoose.model('comment', comment)