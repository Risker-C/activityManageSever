const {Router} = require('express')
const router = Router()
const auth = require('../utils/auth')
const vote = require('../model/vote')
const activity = require('../model/activity')
const wxLogin = require('../utils/JWTLogin')

router.post('/publish', wxLogin, async(req, res, next) => {
  try {
    const {
      title,
      activityID,
      allNum,
      content,
      options,
      voteType,
      endTime,
      userInfo,
    } = req.body
    console.log(req.body)
    const data = await vote.create({
      title,
      activityID,
      allNum,
      publishUser: userInfo._id,
      content,
      options: options.split(','),
      voteType,
      endTime,
    })
    var act = await activity.updateOne({_id: activityID},{$push: {votes: data._id}})
    console.log('act:',act)
    res.json({
        code: 200,
        msg: '投票发起成功',
        data: data._id
    })
  } catch (error) {
    res.json({
      code: 500,
      error: error
    })
  }
})

module.exports = router

