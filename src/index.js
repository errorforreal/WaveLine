const path = require('path')
require('dotenv').config({
    path: path.resolve(__dirname, '../.env')
  });



const express = require('express');
const connectToMongo = require('./connection');

const userRoute = require('./router/user');
const connectionRoute = require('./router/connection');

const { initUiWebSocket } = require('../modules/message/ui-ws');

const app = express();
connectToMongo('mongodb://localhost:27017/Waveline').then(()=>{
    console.log('MongoDB connected....');
    
});


app.use(express.json());
app.use(express.static(path.join(__dirname , '../public')));
app.use(express.urlencoded({extended : false}));
app.use('/user', userRoute);
app.use('/connection',connectionRoute );





const server= app.listen(8000, ()=>{
    console.log('Server is listening...');
    
})

initUiWebSocket(server);