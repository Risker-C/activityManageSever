const mongoose = require('mongoose')

const comment = mongoose.Schema({
  activityID: {
    type: mongoose.SchemaTypes.ObjectId,
    required: true
  },
  parentID: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'comment'
  },
  commentTo: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'wxUser',
    required: true
  },
  commentToName: {
    type: String,
    required: true
  },
  commentUser:{
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'wxUser',
    required: true
  },
  commentUserName: {
    type: String,
    required: true
  },
  commentUserAvatar: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true,
  }
},{versionKey: false, timestamps: {createdAt: 'create_time', updated: 'update_time'}})

module.exports = mongoose.model('comment', comment)