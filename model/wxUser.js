const mongoose =  require('mongoose')

const wxUser = new mongoose.Schema({
  openid:{
    type: String,
    required: true,
    unique: true
  },
  username: {
    type: String,
    required: true,
  },
  avatar: { //头像
    type: String,
    default: "http://pbl.yaojunrong.com/icon_default.png" //默认设置一个头像
  },
  publishActivity: [
    {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'activity'
    }
  ],
  attendActivity: [
    {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'activity'
    }
  ],
  sex: {
    type: Number,
    default: 0
  },
  QQNumber: {
    type: String,
    default: null
  },
  WXNumber: {
    type: Number,
    default: null
  },
  phone: {
    type: Number,
    default: null
  },
  introduce: {
    type: String,
    default: ''
  },
  age: {
    type: Number,
    default: null
  },
  email: {
    type: String,
    default: ''
  },
  address: {
    type: String,
    default: ""
  },
  msgNumber: {
    type: Number,
    default: 0
  }
}, {versionKey: false, timestamps: {createdAt: 'create_time', updatedAt: 'update_time'}}) // 自动生成添加日期和修改日期

module.exports = mongoose.model('wxUser', wxUser)