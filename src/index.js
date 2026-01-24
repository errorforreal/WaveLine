require('dotenv').config();


const express = require('express');
const path = require('path')
const connectToMongo = require('./connection');

const userRoute = require('./router/user');



const app = express();
connectToMongo('mongodb://localhost:27017/Waveline').then(()=>{
    console.log('MongoDB connected....');
    
});


app.use(express.json());
app.use(express.static(path.join(__dirname , '../public')));
app.use(express.urlencoded({extended : false}));
app.use('/user', userRoute);






app.listen(8000, ()=>{
    console.log('Server is listening...');
    
})