const {Router} = require('express')
const router = Router()
var https = require('https');
const fs = require('fs')
const jwt = require('jsonwebtoken')
const path = require('path')
var WXBizDataCrypt = require('../utils/WXBizDataCrypt');
const wxUser = require("../model/wxUser")
const wx = require('../config/wxconfig.json')
const wxLogin = require('../utils/JWTLogin')

var userArray = [
  'username',
  'avatar',
  'sex',
  'QQNumber',
  'WXNumber',
  'phone',
  'introduce',
  'age',
  'email',
  'address',
  'publishActivity',
  'attendActivity'
]
var getSessionKey = function(code){
  return new Promise((resolve, reject) => {
    https.get('https://api.weixin.qq.com/sns/jscode2session?appid='+wx.appId+'&secret='+wx.appSecret+'&js_code='+code+'&grant_type=authorization_code',function(res){
      res.on("data", function(data){
        console.log("登陆成功：",JSON.parse(data))
        resolve(JSON.parse(data))
      })
    }).on("error", function(e){
      console.log("登录失败:",e)
      reject(e);
    });
  })
}
var returObject = function( object, array=userArray){
  var newObject = {}
  console.log("array",array)
  array.forEach((item,index) => {
    switch (item) {
      case 'publishActivity':
        newObject['publishNum'] = object[item] ? object[item].length : 0
        break;
      case 'attendActivity':
        newObject['attendNum'] = object[item] ? object[item].length : 0
        break;
      default:
        newObject[item] = object[item]?object[item]:''
        break;
    }
  });
  return newObject
}
router.post('/login', async(req, res, next) => {
  try {
    const data = await getSessionKey(req.body.code)
    var pc = new WXBizDataCrypt(wx.appId, data.session_key);
    var datas = pc.decryptData(req.body.encryData , req.body.iv);
    var sessionId = data.openid+data.session_key
    let cert = fs.readFileSync(path.resolve(__dirname,'../config/jwt.pem'))
    var user = await wxUser.findOne({openid: data.openid},{ openid:0,create_time:0,update_time:0})
    if(user){
      console.log("用户信息：",user)
    }else{
      var newUser = await wxUser.create({
        openid: data.openid,
        username: datas.nickName,
        avatar: datas.avatarUrl,
        sex: 0,
      })
      console.log("创建用户：",newUser)
      user = newUser
    }
    let userToken = jwt.sign({
      _id: user._id,
      sessionId: sessionId
      }, cert,
      {
        algorithm: 'RS256',
        expiresIn: '1h'
      });
    console.log("生成的token:",userToken)
    var returnData = returObject(user,["avatar","username","_id"])
    res.json({
      code: 200,
      data: returnData,
      token: userToken
    });
  } catch (error) {
    console.log("错误：",error)
    res.json({
      code: 500,
      error: error
    });
  }
})

router.post('/edit', wxLogin, async(req, res, next) => {
  try {
    const {
      username,
      avatar,
      sex,
      QQNumber,
      WXNumber,
      phone,
      introduce,
      age,
      email,
      address,
      userInfo
    } = req.body
    console.log("body:",req.body, "session:","token:",userInfo)
    const data = await wxUser.updateOne({_id: userInfo._id},{$set:{
      username,
      avatar,
      sex,
      QQNumber,
      WXNumber,
      phone,
      introduce,
      age,
      email,
      address
    }})
    res.json({
      code: 200,
      msg: '信息修改成功',
      data
    })
  } catch (error) {
    console.log("错误信息：",error)
    res.json({
      code: 500,
      error: error
    })
  }
})

router.get('/editDetail', wxLogin, async(req, res, next) => {
  try {
    const { userInfo } = req.body
    console.log("body:",req.body, "session:",req.session,"cookie:",req.cookies,"token:",userInfo)
    const data = await wxUser.findOne({_id: userInfo._id})
    res.json({
      code: 200,
      data
    })
  } catch (error) {
    console.log("错误信息：",error)
    res.json({
      code: 500,
      error: error
    })
  }
})
module.exports = router