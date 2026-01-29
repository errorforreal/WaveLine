const express = require('express');
const connectionReq = require('../../models/connection');
const router = express.Router();

const { handleConnection, handleDisconnect } = require('../../controller/connection');
const isLoggedIn = require('../../middleware/auth');

router.post('/',isLoggedIn , handleConnection );
router.delete('/:id',handleDisconnect);
router.get('/:id', async (req,res)=>{
    const connectionId = req.params.id;

    try{

        const ConnectionReq = await connectionReq.findOne({connectionId});
        const status = ConnectionReq.status;
    
        return res.status(200).json({
            status : status
        })
    }
    catch(error){
        return res.status(404).json({
            message : "Internal Server error"
        })
    }
})

module.exports = router;