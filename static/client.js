var audio = new Audio("/h")
const socket = io()

var typing = false
const container = document.querySelector(".msg-container")
var form = document.getElementById("container")
var input = document.getElementById("inp")
var unmute = document.getElementById("but")

const name1 = prompt("Enter Your Name ")

var names = document.getElementById("users")



unmute.addEventListener("click", () => {
    if (unmute.value == "UNMUTE") {
        unmute.value = "MUTE"
        audio.muted = false
    } else {
        unmute.value = "UNMUTE"
        audio.muted = true
    }
    
    }
)

function write(msg, pos) {
    var msg1 = document.createElement("div")
    
    msg1.innerText = msg
    msg1.classList.add("message")
    msg1.classList.add(pos)
    container.append(msg1)
    if (pos == "left") {
        audio.play()
    }
}





socket.emit("new-user", name1)
// socket.emit("disconnect", "hi")  

socket.on("user-joined", data => {
    write(`${data.user} joined the chat`, "left")
    while (names.childNodes.length > 2) {  
        names.removeChild(names.lastChild);
      }
      for (i in data.list){
          var option = document.createElement("option")
          option.text = data.list[i]
          option.id = data.list[i]
          names.add(option)
          container.scrollTop = container.scrollHeight - container.clientHeight;
        }
    self = document.getElementById(name1)
    try {
        
        self.parentNode.removeChild(self)
    } catch (error) {
        console.log("error")
    }
})
socket.on("leave", left => {
    write(`${left.user} left the chat`, "left")
    var item = document.getElementById(left.user)
    item.parentNode.removeChild(item)
    container.scrollTop = container.scrollHeight - container.clientHeight;
})
socket.on("msg", data => {
    console.log(data.message)
    write(`${data.user} : ${data.message}`, "left")
    container.scrollTop = container.scrollHeight - container.clientHeight;
})
socket.on("msg_private", data => {
    console.log(data.message)
    write(`${data.user} : ${data.message}`, "left")
    container.scrollTop = container.scrollHeight - container.clientHeight;
})
var a
form.addEventListener("submit", (e) => {
    typing  = false
    const name = document.getElementById("users").value
    const inp = input.value
    e.preventDefault()
    if (document.getElementById("users").value == "everyone"){
        socket.emit("message", inp)
    }
    else{
        socket.emit("private message",name,inp)
    }

    write(`You : ${inp}`, "right")
    console.log(typing)
    input.value = ""
    container.scrollTop = container.scrollHeight - container.clientHeight;
    socket.emit("user-typing",typing)
    
})

typing1 =document.getElementById("typing")
socket.on("type", data => {
    
    // write(`${data.user} is typing ...`, "left")
    if (data.typing == true){
        typing1.innerText = `${data.user} is typing ...`
        
    }
    else{
        typing1.innerText = ""
    }
        console.log(data.typing)
    // document.getElementById("typing1").innerText = `${data.user} is typing ...`
    
})
socket.on("joined",data=>{
    while (names.childNodes.length > 2) {  
        names.removeChild(names.lastChild);
      }
      for (i in data.list){
          var option = document.createElement("option")
          option.text = data.list[i]
          option.id = data.list[i]
          names.add(option)
          container.scrollTop = container.scrollHeight - container.clientHeight;
        }
        try {
        
            self.parentNode.removeChild(self)
        } catch (error) {
            console.log("error")
        }
})

input.addEventListener("input", (e)=>{
    typing = true
    if (input.value == ""){
        typing = false
        socket.emit("user-typing",typing)
    }
    e.preventDefault
    console.log("you are inputing something")
    socket.emit("user-typing",typing)
    console.log(input.value)
})
function previewFile() {
    const preview = document.querySelector('img');
    const file = document.querySelector('input[type=file]').files[0];
    const reader = new FileReader();
  
    reader.addEventListener("load", function () {
      // convert image file to base64 string
      preview.src = reader.result;
      console.log()
    }, false);
  
    if (file) {
      reader.readAsDataURL(file);
    }
  }




