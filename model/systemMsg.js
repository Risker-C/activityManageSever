const mongoose = require('mongoose')

const systemMsg = mongoose.Schema({
  activityID: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'activity',
    required: true
  },
  parentID: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'wxUser'
  },
  userID: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'wxUser'
  }
},{versionKey: false, timestamps: {createdAt: 'create_time', updated: 'update_time'}})

module.exports = mongoose.model('systemMsg', systemMsg)