// const app = require("express")
// app.use(function (req, res, next) {

//     res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8888');
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
//     res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
//     res.setHeader('Access-Control-Allow-Credentials', true);

//     next();1
// });
// console.log(io);
const express = require('express');
const app = express()
const fs = require("fs")
const port = process.env.PORT || 3000
const path = require('path');
const http = require('http').Server(app);
const io = require('socket.io')(http);
// const html = fs.readFileSync("/static/index.html")

app.get('/h', (req, res) => {

  // res.writeHead(200, {'Content-Type': 'video/mp4'});
  // let opStream = fs.createReadStream('/home/Downloads/me_at_the_zoo.mp4');
  res.writeHead(200, { 'Content-Type': 'audio/wav' });
  let opStream = fs.createReadStream('notification.wav');

  opStream.pipe(res);

});
app.get('/', (req, res) => {
  res.sendFile(__dirname + "/static/index.html")
});
app.get('/js', (req, res) => {
  res.sendFile(__dirname + "/static/client.js")
});
app.get('/css', (req, res) => {
  res.sendFile(__dirname + "/static/style.css")
});

console.log("hi");
client = {}
io.on("connection", socket => {
  socket.on("new-user", name => {
    console.log("new user joined", name)
    client[socket.id] = name
    socket.broadcast.emit("user-joined", name);
  })
  socket.on("message", message => {
    console.log(message)
    socket.broadcast.emit("msg", { message: message, user: client[socket.id] })
  })
  socket.on("disconnect", (reason) => {
    socket.broadcast.emit("leave", { user: client[socket.id] })
    console.log(reason)
  });
  socket.on("user-typing",(data)=>{
    if (data == true){
      socket.broadcast.emit("type" , {typing: data ,user : client[socket.id]})}
      else if (data == false){
        socket.broadcast.emit("type",{typing : data})
      }
  })
})
http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});
