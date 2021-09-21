const express = require('express');
const path = require('path');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

server.listen(3000);

app.use(express.static(path.join(__dirname,'public')));


let connectUsers = [];

 io.on('connection',(socket) => {
        console.log("conexão conectada...");

        socket.on('FalaComServidor',(username) => {            
            socket.username = username;
            connectUsers.push(username);
            console.log('Lista com novo usuário: '+connectUsers);
            socket.emit('user-ok',connectUsers);
            socket.broadcast.emit('list-update',{
                entrou: username,
                list: connectUsers
            });
        });

        socket.on('disconnect',()=>{
            connectUsers = connectUsers.filter(u=>u!=socket.username); //removoendo o usuario que disconectou do sistema. retirando ele do vetor
            console.log('nova lista após saida de usuário: ' + connectUsers);

            socket.broadcast.emit('list-update',{
                saiu: socket.username,
                list: connectUsers
            });
            
        });

        socket.on('send-msg',(txt)=>{
            let obj ={
                username: socket.username,
                msg: txt
            };

            //socket.emit('show-msg',obj);
            socket.broadcast.emit('show-msg',obj);
        });
 });