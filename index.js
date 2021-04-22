
const express = require('express');
const app = express()
const fs = require("fs")
const port = process.env.PORT || 3000
const http = require('http').Server(app);
const io = require('socket.io')(http, {
  pingInterval: 10000,
  pingTimeout: 180000,
  maxHttpBufferSize:1e9,
});
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
    socket.emit("disconn")
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
  socket.on("base64 file",(msg,anotherSocketId,filetype)=>{
    if (anotherSocketId == "everyone"){
      socket.broadcast.emit("base 64",msg,"To Everyone",client[socket.id],filetype)
    }else{
      socket.to(anotherSocketId).emit("base 64",msg,"Direct Message",client[socket.id],filetype)
    }

    socket.emit("uploaded","message received")
  })
  socket.on("radio", (anotherSocketId,blob)=> {
    // can choose to broadcast it to whoever you want
    if (anotherSocketId == "everyone"){
      socket.broadcast.emit("voice", blob,`${client[socket.id]} : Everyone`);
    }else{
      socket.to(anotherSocketId).emit("voice",blob,`${client[socket.id]} : Direct Message`);
      console.log("to me")
    }
    socket.emit("uploaded","message received ")

});
})

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});

