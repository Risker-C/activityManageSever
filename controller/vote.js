const {Router} = require('express')
const router = Router()
const auth = require('../utils/auth')
const vote = require('../model/vote')
const activity = require('../model/activity')

router.post('/publish', async(req, res, next) => {
  try {
    const {
      title,
      activityID,
      allNum,
      agreeNum,
      publishUser,
      opposeNum,
    } = req.body
    console.log(req.body)
    const data = await vote.create({
      title,
      activityID,
      allNum,
      agreeNum,
      publishUser,
      opposeNum,
    })
    var act = await activity.updateOne({_id: activityID},{$push: {votes: data._id}})
    console.log('act:',act)
    res.json({
        code: 200,
        msg: '投票发起成功',
        data
    })
  } catch (error) {
    res.json({
      code: 500,
      error: error
    })
  }
})

module.exports = router

