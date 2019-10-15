const express = require('express');
const http = require('http');
const WebSocketServer = require('ws').Server;
const mustacheExpress = require('mustache-express');
const cookieParser = require('cookie-parser');
const path = require('path');
require('dotenv').config();

const rooms = require('./Rooms');
const indexRouter = require('./routes/index');
const roomsRouter = require('./routes/api/rooms');

// initialise express app
const app = express();
const port = process.env.PORT || '4000';
const host = 'localhost';
app.set('port', port);
app.set('host', host);

// set view engine to mustache
app.engine('html', mustacheExpress());
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));


app.use('/public', express.static('public'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// route urls to this file
app.use('/', indexRouter);
app.use('/api/rooms', roomsRouter);

// create http server
const server = http.createServer(app);
// create ws server with the http server
const wsServer = new WebSocketServer({ server });

server.listen(port, host, () => console.log(`listening at port ${port}`));
/* server.on('error', onError);
server.on('listening', onListening); */

/**
 * TODO add database for rooms
**/

// wss 
wsServer.on('connection', (clientsocket, request) => {
    // request is the http GET request from the client
    //check origin

    origin = request.headers.origin;
    
    //console.log(request.headers);

    if(origin == `http://${host}:${port}`) console.log('valid user');
    else clientsocket.close();
    
    clientsocket.on('message', message => {
        message = JSON.parse(message);
        
        if(message.type == "joinRoom") {
            let roomId = message.data;
            clientsocket.roomId = roomId;
            let roomToJoin = rooms.find(room => room.id === roomId)
            
            roomToJoin.clients.push(clientsocket);
            console.log(`A user connected to room ${roomId}`);
            // send existing data if any to the new client
            clientsocket.send(JSON.stringify({ type:'document', data: roomToJoin.data }));
        }
        if(message.type == 'canvas') {
            roomToSend = rooms.find(room => room.id === clientsocket.roomId);
            wsServer.clients.forEach(client => {
                if(client != clientsocket) {
                    client.send(JSON.stringify({type:'canvas', data:message.data}));
                }
            }); 
        }

        if(message.type == 'document') {
            roomToSend = rooms.find(room => room.id === clientsocket.roomId);
            roomToSend.clients.forEach(client => {
                if(client != clientsocket) {
                    client.send(JSON.stringify({ type:'document', data: message.data })); 
                }
                roomToSend.data = message.data;
            });
        }
    });

    clientsocket.on('close', (event) => {
        console.log(event);
        // normal close
        roomToLeave = rooms.find(room => room.id === clientsocket.roomId);
        roomToLeave.clients = roomToLeave.clients.filter(client => client != clientsocket);
        console.log('client disconnected');
    });

});
