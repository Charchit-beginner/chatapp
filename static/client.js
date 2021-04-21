
var mediaRecorder
var filetype
var audio = new Audio("/h")
const socket = io()
console.log(socket)

var typing = false
const container = document.querySelector(".msg-container")
var form = document.getElementById("container")
var send_btns = document.getElementById("send_btn")
var input = document.getElementById("inp")
var unmute = document.getElementById("but")
var send = document.getElementById("send")
function change_win(){
    container.style.height = `${window.innerHeight - 100}px`
    container.style.width = `${window.innerWidth - 9}px`
send.style.width = `${window.innerWidth - 9}px`
input.style.width = `${window.innerWidth -320}px`
}
change_win()
function resize(){
change_win()
}   


var name1 = prompt("Enter Your Name. Please choose a small name upto 10 leters, if you want to recod enable microphone  ")
try {
    if (name1.indexOf(" ",name1.length -1)){
        name1 = name1.trimEnd()
    }
} catch (error) {
    name1 = "Anonomyus"
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
    container.scrollTop = container.scrollHeight - container.clientHeight;

}


function append_img(pos,direct,filetype){
    preview1 = document.getElementById("display_img")
    if (preview1){
        preview1.id = "image_displayed"
    }
    send_type = document.createElement("div")
    if (filetype == 'mp4' || filetype == 'ogg' || filetype == 'mkv'){
    image = document.createElement("video")
    image.width = 400
    image.height = 320
    image.controls = true
}  
 else if (filetype == 'mp3' || filetype == 'wav' || filetype == 'aac' || filetype == 'wma' || filetype == 'm4a') {
    image = document.createElement("audio")
    image.controls = true    
}
else{
image = document.createElement("img")
}
    

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
    preview.style.outline = "none"
    if (pos == "left") {
        audio.play()
    }
    container.scrollTop = container.scrollHeight - container.clientHeight;

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

function record_audio(){
    var constraints = { audio: true };
    navigator.mediaDevices.getUserMedia(constraints).then(function(mediaStream) {
     mediaRecorder = new MediaRecorder(mediaStream);
     window.streamReference = mediaStream
    mediaRecorder.onstart = function(e) {
        this.chunks = [];
    };
    mediaRecorder.ondataavailable = function(e) {
        this.chunks.push(e.data);
    };
    mediaRecorder.onstop = function(e) {
        var blob = new Blob(this.chunks, { 'type' : 'audio/ogg; codecs=opus' });
        socket.emit("radio",document.getElementById("users").value ,blob);
        console.log(document.getElementById("users").value)

        if (document.getElementById("users").value == "everyone"){
        preview = append_img("right","Everyone","mp3")
    }
    else{
        preview = append_img("right","Direct Message","mp3")
    }
    preview.src = window.URL.createObjectURL(blob)
    };

    // Start recording
    var    btn = document.createElement("button")
    function audio_stream(){
        var send_audio = document.getElementById("send_audio")
    
    send_audio.addEventListener("click",(e)=>{
        e.preventDefault()
        a=true
        btn.id = "stop_audio"
        btn.classList.add("btn")
        btn.innerText = "Stop"
        console.log("123123")
        mediaRecorder.start();
        send_btns.insertBefore(btn,send_audio.parentElement.children[2])
        send_audio.parentNode.removeChild(send_audio)
        
    })}
    audio_stream()
    btn.addEventListener("click", (e)=>{
        e.preventDefault()
        console.log("fsfsfsfs");
        mediaRecorder.stop()
        var stop_audio = document.getElementById("stop_audio")
        btn2 = document.createElement("button")
        btn2.id = "send_audio"
        btn2.innerText = "Record"
        btn2.classList.add("btn")
        send_btns.insertBefore(btn2,names.parentElement.children[2])
        stop_audio.parentNode.removeChild(stop_audio)
        audio_stream()
        
    })
    
    
});
    socket.on('voice', (arrayBuffer,from)=> {
        var blob = new Blob([arrayBuffer], { 'type' : 'audio/ogg; codecs=opus' });
        msg = append_img("left",from,"mp3")

        msg.src = window.URL.createObjectURL(blob)
        console.log(window.URL.createObjectURL(blob))
  });
}


try {
    
    record_audio()    
} catch (error) {
    console.log("can't sed audio")
}

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

function shut(){
    try {
        mediaRecorder.stop()
        
    } catch (error) {
        console.log("media already stopped")
    }
    if (window.streamReference) {
        window.streamReference.getAudioTracks().forEach(function(track) {
            track.stop();
        });

        window.streamReference.getVideoTracks().forEach(function(track) {
            track.stop();
        });

        window.streamReference = null;
    }
}
async function previewFile() {
    record_audio()
    const file = document.querySelector('input[type=file]').files[0];
    filetype = file["name"].split(".").pop()
    console.log('original instanceof Blob', file instanceof Blob)
    
    const options = {
        maxSizeMB: 0.2,
        maxWidthOrHeight: 600,
        useWebWorker: true
    }


    // convert image file to base64 string
    try {

        var compressedFile = await imageCompression(file, options);
        console.log('compressedFile instanceof Blob', compressedFile instanceof Blob)
        await readthensendfile(compressedFile)
    } catch (error) {
        console.log(error)
        
        await readthensendfile(file)
        

    }






}
function readthensendfile(data) {
    var client_name = document.getElementById("users").value
    if (client_name != "everyone"){
    preview = append_img("right","Direct Message",filetype)
}
else{
        preview = append_img("right","To Everyone",filetype)

    }
    const reader = new FileReader();
    reader.addEventListener("load",  function (evt) {
        preview.src = evt.target.result;
        a = evt.target.result
        console.log(a)
        socket.emit("base64 file", a,client_name,filetype)
    }, false);

        reader.readAsDataURL(data);
    container.scroll(1,container.scrollHeight)
    
    image_inp = document.getElementById("image_inp")
    image_inp.value = ""
    reader.onprogress = function (currentfile){
        if (currentfile.lengthComputable){
        console.log("uploading")
    }
    }
}
socket.on("base 64", (data,direct,client,file) => {

    preview = append_img("left",`${client} : ${direct}`,file)
    
    preview.src = data

})




