
const socket = io("http://localhost:8000" ,  { transports: ['websocket', 'polling', 'flashsocket'] });

const container  = document.querySelector(".msg-container")
var form = document.getElementById("container")
var input =  document.getElementById("inp")

function write(msg,pos){
    var msg1 = document.createElement("div")
    msg1.innerText = msg
    msg1.classList.add("message")
    msg1.classList.add(pos)
    container.append(msg1)
}



const name1 = prompt("Enter Your Name ")
socket.emit("new-user", name1)
// socket.emit("disconnect", "hi")  

socket.on("user-joined",name1=>{
    write(`${name1} joined the chat`,"right")
    container.scrollTop = container.scrollHeight - container.clientHeight;
})
socket.on("leave",left=>{
    write(`${left.user} left the chat`,"left")
    container.scrollTop = container.scrollHeight - container.clientHeight;
})
socket.on("msg",data=>{
    console.log(data.message)
    console.log("FDSFa")
    write(`${data.user} : ${data.message}`,"left")
    container.scrollTop = container.scrollHeight - container.clientHeight;
})
form.addEventListener("submit",(e)=>{
    const inp = input.value
    e.preventDefault()
    console.log("hi")
    socket.emit("message", inp)
    console.log("hi");
    write(`You : ${inp}`,"right")
    input.value = ""
    container.scrollTop = container.scrollHeight - container.clientHeight;
}) 







// var inp = document.getElementById("inp")
// a = 1
// document.addEventListener("keydown", keydownhandle,false)

// function keydownhandle(e){
//     messages = document.getElementById("message")
//     if (e.key == "Enter"){
//     console.log(inp.value);
//     let usediv = document.createElement("div");
//     // usediv.id = "usediv"
//     usediv.innerHTML = inp.value;
//     messages.appendChild(usediv);
//     }
// }
