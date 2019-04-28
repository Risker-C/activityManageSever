const {Router} = require('express')
const router = Router()
const auth = require('../utils/auth')
const wxLogin = require('../utils/JWTLogin')
const activity = require('../model/activity')

router.post('/publish', wxLogin, async(req, res, next) => {
  try {
    const {
      title,
      content,
      attendUsers=[],
      reqlies=[],
      votes=[],
      userInfo,
    } = req.body
    console.log("body:",req.body)
    var userId = userInfo._id
    attendUsers.push(userId)
    const data = await activity.create({
      title,
      content,
      attendUsers:attendUsers,
      reqlies,
      votes,
      publishUser: userId
    })
    res.json({
      flag: 200,
      id: data._id
    })
  } catch (error) {
    next(error)
  }
})

router.get('/all', async(req, res, next) => {
  try {
    let {pageNum=0, pageSize=10} = req.query
    let {userInfo} = req.body
    pageNum = parseInt(pageNum)
    pageSize = parseInt(pageSize)
    var data = await activity
        .find()
        .skip(pageNum * pageSize)
        .limit(pageSize)
        .populate({
          path: 'publishUser',
          select: 'avatar username'
        })
        .sort({'update_time': -1})
    const count = await activity.countDocuments()
    res.json({
        code: 200,
        data,
        pager: parseInt(count/pageSize),
        msg: 'success'
    })
  } catch (error) {
    next(error)
  }
})

router.get('/my', wxLogin, async(req, res, next) => {
  try {
    let {pageNum=0, pageSize=10} = req.query
    let {userInfo} = req.body
    console.log("query:", req.query, "body:", req.body)
    pageNum = parseInt(pageNum)
    pageSize = parseInt(pageSize)
    var data = await activity
        .find({publishUser: userInfo._id},{ openid:0,create_time:0,update_time:0})
        .skip(pageNum * pageSize)
        .limit(pageSize)
        .populate({
          path: 'publishUser',
          select: 'avatar username'
        })
    const count = await activity.countDocuments()
    res.json({
        code: 200,
        data,
        pager: parseInt(count/pageSize)
    })
  } catch (error) {
    next(error)
  }
})

router.get('/detail', async(req, res, next) => {
  try {
    const { id } = req.query
    const detail = await activity
      .findOne({_id: id}, {"create_time": 0, "update_time": 0})
      .populate({
        path: "publishUser",
        select: "avatar username _id"
      })
      .populate({
        path: "attendUsers",
        select: "avatar username _id"
      })
      .populate({
        path: "reqlies"
      })
      .populate({
        path: "votes"
      })
      console.log("id:",id,"detail:",detail)
    if(detail){
      res.json({
        flag: 200,
        data: detail
      })
    } else {
      res.json({
        flag: 400,
        msg: "没有该活动"
      })
    }
  } catch (error) {
    next(error)
  }
})
module.exports = router

