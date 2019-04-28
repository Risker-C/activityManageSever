const express = require('express');
const router = express.Router();

const wxUser = require('../controller/wxUser')
const activity = require('../controller/activity')
const comment = require('../controller/comment')
const vote = require('../controller/vote')

router.use('/applet', wxUser)
router.use('/activity', activity)
router.use('/comment', comment)
router.use('/vote', vote)


module.exports = router;
