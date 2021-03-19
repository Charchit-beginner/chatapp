// const app = require("express")
// app.use(function (req, res, next) {

//     res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8888');
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
//     res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
//     res.setHeader('Access-Control-Allow-Credentials', true);

//     next();
// });
// console.log(io);
const express = require('express');
const app = express()
const fs = require("fs")
const port = process.env.PORT || 3000
const http = require('http').Server(app);
const io = require('socket.io')(http);
// const html = fs.readFileSync("/static/index.html")
app.get('/', (req, res) => {
    res.sendFile(__dirname+ "/static/index.html")
  });;
console.log("hi");
client = {}
io.on("connection",socket=>{
    socket.on("new-user",name=>{
        console.log("new user joined", name)
        client[socket.id] = name
        socket.broadcast.emit("user-joined",name);
    })
    socket.on("message",message=>{
        console.log(message)
        socket.broadcast.emit("msg",{message:message,user:client[socket.id]})
    })
    socket.on("disconnect", (reason) => {
        socket.broadcast.emit("leave",{user:client[socket.id]})
        console.log(reason)
      });
})
http.listen(port, () => {
    console.log(`Socket.IO server running at http://localhost:${port}/`);
  });
  