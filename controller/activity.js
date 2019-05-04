const {Router} = require('express')
const router = Router()
const mongoose = require('mongoose')
const auth = require('../utils/auth')
const wxLogin = require('../utils/JWTLogin')
const activity = require('../model/activity')
const returObject = require('../utils/utils')
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

router.get('/detail', wxLogin, async(req, res, next) => {
  try {
    const { userInfo } = req.body
    const { id } = req.query
    const detail = await activity
      .aggregate([
        {
          $lookup: //连表关键词，类似mysql中的left join 
          {
              from: "wxusers",//需要连接的表名
              localField: "publishUser",//本表需要关联的字段
              foreignField: "_id",//被连接表需要关联的字段
              as: "publishUser"//查询出的结果集别名
          }
        },{
          $lookup: //连表关键词，类似mysql中的left join 
          {
              from: "wxusers",//需要连接的表名
              localField: "attendUsers",//本表需要关联的字段
              foreignField: "_id",//被连接表需要关联的字段
              as: "attendUsers"//查询出的结果集别名
          }
        },{
          $lookup: //连表关键词，类似mysql中的left join 
          {
            from: "comments",//需要连接的表名
            localField: "reqlies",//本表需要关联的字段
            foreignField: "_id",//被连接表需要关联的字段
            as: "reqlies"//查询出的结果集别名
          }
        },{
          $lookup: //连表关键词，类似mysql中的left join 
          {
            from: "votes",//需要连接的表名
            localField: "votes",//本表需要关联的字段
            foreignField: "_id",//被连接表需要关联的字段
            as: "votes"//查询出的结果集别名
          }
        },{
          $lookup: //连表关键词，类似mysql中的left join 
          {
            from: "comments",//需要连接的表名
            localField: "_id",//本表需要关联的字段
            foreignField: "activityID",//被连接表需要关联的字段
            as: "comments"//查询出的结果集别名
          }
        },
        {$match: {"_id": mongoose.Types.ObjectId(id)}},
        { $unwind: "$publishUser" },
        {
          $project:
          {
              _id: 1,
              "attendUsers.avatar": 1,
              "attendUsers._id": 1,
              "attendUsers.username": 1,
              "attendUsers.update_time": 1,
              "publishUser.avatar": 1,
              "publishUser.username": 1,
              "publishUser.update_time": 1,
              "publishUser._id": 1,
              "content": 1,
              "update_time": 1,
              "title": 1,
              "votes": 1,
              "reqlies.commentToName": 1,
              "reqlies.commentUser": 1,
              "reqlies.commentUserName": 1,
              "reqlies._id": 1,
              "reqlies.content": 1,
              "reqlies.create_time": 1,
              "reqlies.parentID": 1,
              "reqlies.commentUserAvatar": 1,
              "reqlies._id": 1,
              "reqlies.comments": [],
              "comments.commentToName": 1,
              "comments.commentUser": 1,
              "comments.commentUserName": 1,
              "comments.content": 1,
              "comments.create_time": 1,
              "comments._id": 1,
              "comments.parentID": 1,
              "comments.commentUserAvatar": 1,
          }
        },
        { $sort: { "create_time": 1 } }
      ])    
    if(detail[0]){
      let haveUser = false
      detail[0].attendUsers.forEach((item)=>{
        if(userInfo._id == item._id){
          haveUser = true
        }
      })
      if(haveUser){
        var returnData = detail[0]
        returnData.comments.forEach(item => {
          console.log("循环comments item.parentID：==>",item.parentID,"returnData.activityID:===>",returnData._id)
          if(item.parentID+"" == returnData._id+""){
            console.log("此条评论为一级评论")
          } else {
            console.log("此条评论为二级评论")
            returnData.reqlies.forEach(item2 => {
              console.log("循环查询：item2._id:===>",item2._id,"item.parentID:===>",item.parentID)
              if(item2._id+"" == item.parentID+""){
                console.log("是当前的评论的二级评论：item2:====>", item2)
                item2.comments.push(item)
              }
            })
          }
        });
        console.log("*************************************\n",returnData.reqlies,"\n***************************\n",detail[0].reqlies)
        var isEdit = null
        if(userInfo._id == returnData.publishUser._id){
          isEdit = 1
        } else {
          isEdit = 0
        }
        res.json({
          flag: 200,
          isEdit,
          data: detail[0]
        })
      } else {
        res.json({
          flag: 402,
          msg: "尚未报名该活动"
        })
      }
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

router.get('/attend', wxLogin, async(req, res, next) => {
  try {
    let {activityID} = req.query
    let {userInfo} = req.body
    var data = await activity.updateOne({_id: activityID},{$push:{attendUsers: userInfo._id}})
    res.json({
      flag: 200,
      data,
      msg: '加入成功'
    })
  } catch (error) {
    next(error)
  }
})

module.exports = router

