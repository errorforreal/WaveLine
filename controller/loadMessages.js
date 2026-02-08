const messages = require('../models/message');
const mongoose = require('mongoose');
const connection = require('../models/connection');

async function loadMessages(req,res){
    const { id } = req.params;

    const connectionReq = await connection.findOne({connectionId : id});
    const _id = connectionReq._id;
    

    try{
        const allMessages = await messages
            .find({connectionId : _id})
            .select('payload createdAt status')
            .sort({createdAt : -1});

        return res.status(200).json({
                allMessages : allMessages
            })
    }
    catch(error){
        return res.status(500).json({
            message : 'Can not load messages'
        })
    }
}

module.exports = loadMessages;