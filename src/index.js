const path = require('path')
require('dotenv').config({
    path: path.resolve(__dirname, '../.env')
  });



const express = require('express');
const connectToMongo = require('./connection');

const userRoute = require('./router/user');
const connectionRoute = require('./router/connection');
const showWorkspace = require('./router/showWorkspace');

const { initUiWebSocket } = require('../modules/connection/ui-ws');

const app = express();
connectToMongo('mongodb://localhost:27017/Waveline').then(()=>{
    console.log('MongoDB connected....');
    
});


app.use(express.json());
app.use(express.static(path.join(__dirname , '../public')));
app.use(express.urlencoded({extended : false}));
app.use('/user', userRoute);
app.use('/connection',connectionRoute );
app.use('/workspace', showWorkspace);





const server= app.listen(8000, ()=>{
    console.log('Server is listening...');
    
})

initUiWebSocket(server);