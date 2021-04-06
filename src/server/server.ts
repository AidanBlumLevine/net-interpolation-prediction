var express = require('express');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');
var app = express();
var server = http.Server(app);
var io = socketIO(server);

import Constants from '../shared/constants';
import GameClass from './game'
const Game = new GameClass(io);

app.set('port', 3000);
app.use(express.static(path.join(__dirname, '/../../dist')));
console.log(path.join(__dirname, '/../../dist'));


app.get("/", (req: any, res: any) => {
    res.sendFile(path.join(__dirname, '../client/html/index.html'));
});

server.listen(3000, () => {
    console.log(`Server is running in http://localhost:3000`);
});

io.on('connection', function (socket: SocketIO.Socket) {
    socket.on(Constants.SOCKET.JOIN, function () { 
        Game.join(socket); 
    });
    socket.on(Constants.SOCKET.INPUTS, function (inputs: Input[]) {
        Game.input(socket, inputs);
    });
    socket.on('disconnect', function () { Game.leave(socket) })
});