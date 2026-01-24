const express = require('express');
const router = express.Router();

const handleConnection = require('../../controller/connection');
const isLoggedIn = require('../../middleware/auth');

router.post('/',isLoggedIn , handleConnection );

module.exports = router;