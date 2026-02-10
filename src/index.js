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
connectToMongo(process.env.MONGO_URL).then(()=>{
    console.log('MongoDB connected....');
    
});


app.use(express.json());
app.use(express.static(path.join(__dirname , '../public')));
app.use(express.urlencoded({extended : false}));
app.use('/user', userRoute);
app.use('/connection',connectionRoute );
app.use('/workspace', showWorkspace);




const PORT = process.env.PORT || 8000;
const server= app.listen(PORT, ()=>{
    console.log('Server is listening...');
    
})

const wss = new WebSocket.Server({ noServer: true });

server.on('upgrade', (req, socket, head) => {
  if (req.url === '/ui-ws') {
    wss.handleUpgrade(req, socket, head, ws => {
      wss.emit('connection', ws, req);
    });
  } else {
    socket.destroy();
  }
});

initUiWebSocket(wss);

