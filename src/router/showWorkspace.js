const express = require('express');
const handleWorkSpace =  require('../../controller/showWorkspace');
const isLoggedIn = require('../../middleware/auth');
const loadMessages = require('../../controller/loadMessages');

const router = express.Router();


router.get('/api', isLoggedIn, handleWorkSpace);
router.get('/api/:id', loadMessages);

module.exports = router;