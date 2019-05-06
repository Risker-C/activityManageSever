const {Router} = require('express')
const mongoose = require('mongoose')
const router = Router()
const auth = require('../utils/auth')
const vote = require('../model/vote')
const activity = require('../model/activity')
const wxLogin = require('../utils/JWTLogin')
// 发起一个投票
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
    // console.log(req.body)
    var optionList = options.split(',')
    var optionVote = []
    optionList.forEach( item => {
      optionVote.push({name: item,data: 0})
    })
    const data = await vote.create({
      title,
      activityID,
      allNum,
      publishUser: userInfo._id,
      content,
      options: optionList,
      voteType,
      endTime,
      optionVote,
    })
    var act = await activity.updateOne({_id: activityID},{$push: {votes: data._id}})
    // console.log('act:',act)
    res.json({
        code: 200,
        msg: '投票发起成功',
        data: data._id
    })
  } catch (error) {
    next(error)
  }
})
// 活动单条活动详细信息
router.get('/detail', wxLogin, async(req, res, next) => {
  try {
    const { userInfo } = req.body
    const { id } = req.query
    const detail =  await vote.findOne({_id: id})
    var userVoted = detail.userVoted,isVoted=false
    userVoted.forEach(item => {
      if(item.userID == userInfo._id){
        isVoted = true
      }
    })
    res.json({
      flag: 200,
      data: detail,
      isVoted: isVoted
    })
  } catch (error) {
    next(error)
  }
})
// 投票
router.post('/add', wxLogin, async(req, res, next) => {
  try {
    const {
      id,
      options,
      userInfo,
    } = req.body
    // console.log(req.body)
    const vateData = await vote.findOne({_id: id})
    var optionVote = vateData.optionVote
    var userVoted = vateData.userVoted
    var ifVoted = false
    userVoted.forEach(item => {
      if(item.userID == userInfo._id){
        ifVoted = true
      }
    })
    if(ifVoted){
      res.json({
        code: 500,
        msg: '该用户已投过票'
      })
    } else {
      var optionList = options.split(',')
      optionList.forEach(item => {
        optionVote[item].data ++
      })
      const data = await vote.updateOne(
        {_id: id},
        {
          $inc:{allNum: 1},
          $set: {optionVote: optionVote},
          $push: {
            userVoted: {
              userID: mongoose.Types.ObjectId(userInfo._id),
              options: options
            }
          }
        })
      res.json({
        code: 200,
        msg: '投票成功',
      })
    }
  } catch (error) {
    next(error)
  }
})
module.exports = router

