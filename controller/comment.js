const {Router} = require('express')
const router = Router()
const auth = require('../utils/auth')
const comment = require('../model/comment')
const activity = require('../model/activity')

router.post('/publish', async(req, res, next) => {
  try {
    const {
      activityID,
      parentID=null,
      commentTo,
      commentUser,
      content
    } = req.body
    console.log(req.body)
    const data = await comment.create({
      activityID,
      parentID,
      commentTo,
      commentUser,
      content
    })
    var act = await activity.updateOne({_id: activityID},{$push: {reqlies: data._id}})
    console.log("act:", act)
    res.json({
      code: 200,
      msg: '评论成功',
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

