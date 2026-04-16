const express = require('express');
const router = express.Router();
const {handleLogin, handleSignup, handleLogout} = require('../../controller/user');
const isLoggedIn = require('../../middleware/auth');

router.post('/login', handleLogin);
router.post('/signup', handleSignup);
router.post('/logout', isLoggedIn, handleLogout);

module.exports = router;