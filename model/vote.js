const mongoose =  require('mongoose')

const vote = new mongoose.Schema({
  title: {
    type: String,
    default: '',
    required: true
  },
  activityID: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'activity',
    required: true,
  },
  publishUser: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'wxUser',
    required: true
  },
  allNum: {
    type: Number,
    default: 0,
    required: true
  },
  agreeNum: {
    type: Number,
    default: 0
  },
  opposeNum: {
    type: Number,
    default: 0
  }
}, {versionKey: false, timestamps: {createdAt: 'create_time', updatedAt: 'update_time'}}) // 自动生成添加日期和修改日期

module.exports = mongoose.model('vote', vote)