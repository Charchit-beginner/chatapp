
const express = require('express');
const app = express()
const fs = require("fs")
const port = process.env.PORT || 3000
const path = require('path');
const http = require('http').Server(app);
const io = require('socket.io')(http);
// const html = fs.readFileSync("/static/index.html")

app.get('/h', (req, res) => {

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
app.get('/mute', (req, res) => {
  res.sendFile(__dirname + "/static/mute.ico")
});
app.get('/unmute', (req, res) => {
  res.sendFile(__dirname + "/static/unmute.ico")
});

console.log("hi");
client = {}
io.on("connection", socket => {
  socket.on("new-user", name => {
    console.log("new user joined", name)
    client[socket.id] = name
    socket.broadcast.emit("user-joined", {user : name,list :client});

    socket.join(name)
  })
  socket.on("message", message => {
    
    socket.broadcast.emit("msg", { message: message, user: client[socket.id] })
    console.log("to all")
  })
  socket.on("disconnect", (reason) => {
    socket.broadcast.emit("leave", { user: client[socket.id] })
    console.log(reason)
    delete    client[socket.id]
  });
  socket.on("user-typing",(data)=>{
    if (data == true){
      socket.broadcast.emit("type" , {typing: data ,user : client[socket.id]})}
      else if (data == false){
        socket.broadcast.emit("type",{typing : data})
      }
  })
  socket.on("private message", (anotherSocketId, msg) => {
    console.log(anotherSocketId)
    socket.to(anotherSocketId).emit("msg_private",{user : client[socket.id], message : msg})
    console.log("privatemsg");
  });
  socket.emit("joined",{list:client})
  socket.on("base64 file",(msg)=>{
    socket.broadcast.emit("base 64",msg)

  })
})

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});

