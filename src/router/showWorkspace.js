const express = require('express');
const handleWorkSpace =  require('../../controller/showWorkspace');
const isLoggedIn = require('../../middleware/auth');

const router = express.Router();

router.get('/', (req,res)=>{
    return res.render('workspace');
} );

router.get('/api', isLoggedIn, handleWorkSpace);
module.exports = router;