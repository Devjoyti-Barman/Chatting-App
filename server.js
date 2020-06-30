const express = require('express')
const http=require('http')
const socketio=require('socket.io') // return a function

const app=express() //it create express application
const server=http.createServer(app) // creating http server using express application
const io= socketio(server)

// io.on means when a client is connected to http server 
// I listen on the connection event for incoming sockets and log it to the console


const users={};

io.on('connection', (socket) => {
    
    socket.on('new-user-joined',name=>{
         console.log(name);
        users[socket.id]=name;
        socket.broadcast.emit('user-joined',name);
    });

    socket.on('send',message=>{
        socket.broadcast.emit('receive',{message:message,name:users[socket.id]});
    });

    socket.on('disconnect',message=>{
        socket.broadcast.emit('leave',users[socket.id]);
        delete users[socket.id];
    });

})

app.use('/',express.static(__dirname+'/public'))

 
server.listen(3000,()=>{
    console.log('Started on http://localhost:3000')
})