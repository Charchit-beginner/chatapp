var audio = new Audio("/h")
const socket = io()

var typing = false
const container = document.querySelector(".msg-container")
var form = document.getElementById("container")
var input = document.getElementById("inp")
var unmute = document.getElementById("but")

const name1 = prompt("Enter Your Name ")
function addname(){
var names = document.getElementById("users")
var option = document.createElement("option")
// option.value = name1
option.text = name1
names.add(option)
}
addname()

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

socket.on("user-joined", name1 => {
    write(`${name1} joined the chat`, "left")
    container.scrollTop = container.scrollHeight - container.clientHeight;

})
socket.on("leave", left => {
    write(`${left.user} left the chat`, "left")
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
    const inp = input.value
    e.preventDefault()
    if (inp.includes("pri")){
        socket.emit("private message","chirag",inp)
    }
        else{
        socket.emit("message", inp)}

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

input.addEventListener("input", (e)=>{
    typing = true
    if (input.value == ""){
        typing = false
        console.log("you bulshit")
        socket.emit("user-typing",typing)
    }
    e.preventDefault
    console.log("you are inputing something")
    socket.emit("user-typing",typing)
    console.log(input.value)
})




