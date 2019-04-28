const mongoose = require('mongoose')
//创建连接

mongoose.connect('mongodb://localhost/manageActivity', { useNewUrlParser: true, useCreateIndex: true})
const connection = mongoose.connection

//监听连接事件
connection.on('error', console.error.bind(console, 'connection error'))
connection.once('open', function() {
    console.log('connection is open')
})

module.exports = connection