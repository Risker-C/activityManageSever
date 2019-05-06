
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
 
module.exports = async function (req, res, next) {
    const requestToken = req.get('token');
    // console.log("requestToken: ",requestToken)
    let cert = fs.readFileSync(path.resolve(__dirname, '../config/jwt_pub.pem'));
    // console.log('cert: ',cert)
    try {
        var user =  await jwt.verify(requestToken, cert);
        // console.log("解密的数据：", user)
        req.body.userInfo = user
        next();
    } catch (error) {
        console.log("解密失败：", error)
        res.json({
            flag: -999,
            error
        })
    }
};