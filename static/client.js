
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

const name1 = prompt("Enter Your Name ")

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


function append_img(pos,img){
    preview1 = document.getElementById("display_img")
    if (preview1){
        preview1.id = "image_displayed"
    }

    image = document.createElement("img")
    image.id = "display_img"
    // image.classList.add("message")
    image.classList.add(pos)
    image.innerText = img
    container.append(image)
    const preview = document.getElementById('display_img');
    if (pos == "left") {
        audio.play()
    }
    return preview

}

socket.emit("new-user", name1)
// socket.emit("disconnect", "hi")  

socket.on("user-joined", data => {
    write(`${data.user} joined the chat`, "left")
    handle_private_messaging(data)
    console.log(data.list)
})
socket.on("leave", left => {
    write(`${left.user} left the chat`, "left")
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
    typing = false
    const name = document.getElementById("users").value
    const inp = input.value
    e.preventDefault()
    if (document.getElementById("users").value == "everyone") {
        socket.emit("message", inp)
    }
    else {
        socket.emit("private message", name, inp)
    }

    write(`You : ${inp}`, "right")
    console.log(typing)
    input.value = ""
    container.scrollTop = container.scrollHeight - container.clientHeight;
    socket.emit("user-typing", typing)

})

typing1 = document.getElementById("typing")
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
    
    preview = append_img("right","hi")
    const reader = new FileReader();
    reader.addEventListener("load", async function () {
        preview.src = reader.result;
        
        socket.emit("base64 file", preview.src)
    }, false);
    if (data) {
        reader.readAsDataURL(data);
    }
    container.scroll(1,container.scrollHeight)
    
    image_inp = document.getElementById("image_inp")
    image_inp.value = ""
}
socket.on("base 64", (data) => {

    
    preview = append_img("left","hi")
    // const file = document.querySelector('input[type=file]').files[0];
    const reader = new FileReader();
    preview.src = data


    // if (file) {
    //   reader.readAsDataURL(file);
    // }
})



