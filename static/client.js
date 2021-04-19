
var audio = new Audio("/h")
const socket = io()

var typing = false
const container = document.querySelector(".msg-container")
var form = document.getElementById("container")
var input = document.getElementById("inp")
var unmute = document.getElementById("but")
send = document.getElementById("send")
function change_win(){
container.style.height = `${window.innerHeight - 100}px`
container.style.width = `${window.innerWidth - 9}px`
send.style.width = `${window.innerWidth - 9}px`
input.style.width = `${window.innerWidth -270}px`
}
change_win()
function resize(){
change_win()
}

var name1 = prompt("Enter Your Name ")
if (name1.indexOf(" ",name1.length -1)){
    name1 = name1.trimEnd()
}

var names = document.getElementById("users")

function handle_private_messaging(data) {
    while (names.childNodes.length > 2) {
        names.removeChild(names.lastChild);
    }
    for (i in data.list) {
        var option = document.createElement("option")
        option.text = data.list[i]
        option.id = data.list[i]
        names.add(option)
        
        
        container.scrollTop = container.scrollHeight - container.clientHeight;
    }
    try {
        self = document.getElementById(name1)

        self.parentNode.removeChild(self)
    } catch (error) {
        console.log(error)
    }
}


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

function write(msg, pos,direct ) {
    var msg1 = document.createElement("div")

    var span = document.createElement("span")
    span.id = "type"
    if (direct != "")
   span.innerText = "\n"+direct
    msg1.innerText = msg
    msg1.classList.add("message")
    msg1.classList.add(pos)
    msg1.append(span)
    container.append(msg1)
    if (pos == "left") {
        audio.play()
    }
}


function append_img(pos,img,direct){
    preview1 = document.getElementById("display_img")
    if (preview1){
        preview1.id = "image_displayed"
    }
    send_type = document.createElement("div")
    image = document.createElement("img")
    figure = document.createElement("figure")
    figure_cap = document.createElement("figcaption")
    figure_cap.innerText= direct
    image.id = "display_img"
    // image.classList.add("message")
    image.classList.add(pos)
    image.innerText = img
    // send_type.innerText = "\n" +direct   
    send_type.classList.add(pos)
    send_type.classList.add("caption")
    send_type.id = "caption"
    figure.append(send_type)
    send_type.append(figure_cap)
    figure.append(image)
    // figure.append(figure_cap)
    container.append(figure)
    const preview = document.getElementById('display_img');
    if (pos == "left") {
        audio.play()
    }
    return preview

}

socket.emit("new-user", name1)
// socket.emit("disconnect", "hi")  

socket.on("user-joined", data => {
    write(`${data.user} joined the chat`, "left","")
    handle_private_messaging(data)
    console.log(data.list)
})
socket.on("leave", left => {
    write(`${left.user} left the chat`, "left","")
    try {
        var item = document.getElementById(left.user)

        item.parentNode.removeChild(item)
    } catch (error) {
        console.log(error);
    }
    container.scrollTop = container.scrollHeight - container.clientHeight;
})
socket.on("msg", data => {
    console.log(data.message)
    write(`${data.user} : ${data.message}`, "left","To Everyone")
    container.scrollTop = container.scrollHeight - container.clientHeight;
})
socket.on("msg_private", data => {
    console.log(data.message)
    write(`${data.user} : ${data.message}`, "left","Direct Message")
    container.scrollTop = container.scrollHeight - container.clientHeight;
})
var a
form.addEventListener("submit", (e) => {
    typing = false
    var name = document.getElementById("users").value
    const inp = input.value
    e.preventDefault()
    if (document.getElementById("users").value == "everyone") {
        socket.emit("message", inp)
        write(`You : ${inp}`, "right","To Everyone")
    }
    else {
        socket.emit("private message", name, inp)
        write(`You : ${inp}`, "right","Direct message")
    }

    console.log(typing)
    input.value = ""
    container.scrollTop = container.scrollHeight - container.clientHeight;
    socket.emit("user-typing", typing)
})

typing1 = document.getElementById("typing")
if (typing1.innerText == ""){
    typing1.style.padding = "0px"
}
else{
    typing1.style.padding = "2px"
}
socket.on("type", data => {

    // write(`${data.user} is typing ...`, "left")
    if (data.typing == true) {
        typing1.innerText = `${data.user} is typing ...`

    }
    else {
        typing1.innerText = ""
    }
    console.log(data.typing)
    // document.getElementById("typing1").innerText = `${data.user} is typing ...`

})
socket.on("joined", data => {
    handle_private_messaging(data)
})

input.addEventListener("input", (e) => {
    typing = true
    if (input.value == "") {
        typing = false
        socket.emit("user-typing", typing)
    }
    e.preventDefault
    console.log("you are inputing something")
    socket.emit("user-typing", typing)
    console.log(input.value)
})


async function previewFile() {
    const file = document.querySelector('input[type=file]').files[0];

    const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 500,
        useWebWorker: true
    }


    // convert image file to base64 string
    try {

        var compressedFile = await imageCompression(file, options);
        await readthensendfile(compressedFile)
    } catch (error) {
        console.log(error)
        await readthensendfile(file)

    }






}
function readthensendfile(data) {
    var client_name = document.getElementById("users").value
    if (client_name != "everyone"){
    preview = append_img("right","hi","Direct Message")
}
else{
        preview = append_img("right","hi","To Everyone")

    }
    const reader = new FileReader();
    reader.addEventListener("load", async function () {
        preview.src = reader.result;
        
        socket.emit("base64 file", preview.src,client_name)
    }, false);
    if (data) {
        reader.readAsDataURL(data);
    }
    container.scroll(1,container.scrollHeight)
    
    image_inp = document.getElementById("image_inp")
    image_inp.value = ""
}
socket.on("base 64", (data,direct,client) => {

    preview = append_img("left","hi",`${client} : ${direct}`)
    // const file = document.querySelector('input[type=file]').files[0];
    const reader = new FileReader();
    preview.src = data


    // if (file) {
    //   reader.readAsDataURL(file);
    // }
})



