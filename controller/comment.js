const {Router} = require('express')
const router = Router()
const auth = require('../utils/auth')
const comment = require('../model/comment')
const activity = require('../model/activity')
const wxLogin = require('../utils/JWTLogin')

router.post('/publish',wxLogin, async(req, res, next) => {
  try {
    const {
      activityID,
      parentID=null,
      commentTo,
      commentToName,
      content,
      userInfo
    } = req.body
    console.log(req.body)
    const data = await comment.create({
      activityID,
      parentID,
      commentTo,
      commentToName,
      commentUser: userInfo._id,
      commentUserName: userInfo.username,
      commentUserAvatar: userInfo.avatar,
      content
    })
    if(activityID == parentID){
      var act = await activity.updateOne({_id: activityID},{$push: {reqlies: data._id}})
    }
    console.log("act:", act)
    res.json({
      code: 200,
      msg: '评论成功',
      data
    })
  } catch (error) {
    next(error)
  }
})

module.exports = router

