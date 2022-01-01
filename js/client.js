const socket = io("http://localhost:8000", { transports: ["websocket"] }); //This will connects the index.html  

//Get DOM elements in respective js variables
const form = document.getElementById("send-container");
const messageInput = document.getElementById("messageInp");
const messageContainer = document.querySelector(".container");

//Audio that play after the receiving the messages
var Audio = new Audio("ting.mp3");

//Function which will append events info to the container
const append = (message, position) => {
    const messageElemnet = document.createElement("div");
    messageElemnet.innerText = message;
    messageElemnet.classList.add("message");
    messageElemnet.classList.add(position);
    messageContainer.append(messageElemnet);
    if (position == 'left') {
        Audio.play("ting.mp3");
    }
};


//Ask new user for his/her name and let the server know
const name = prompt("Enter your name to join");
socket.emit("new-user-joined", name);

//If a new user joins, receive his/her name from the server 
socket.on("user-joined", (name) => {
    append(`${name} joined the chat`, 'right');
});

//If server sends a message receive it.
socket.on("receive", (data) => {
    append(`${data.name}:${data.message}`, 'left');
});

//If a user leaves the chat, append the info to the container 
socket.on("left", (name) => {
    append(`${name} left the chat`, 'right');
});

//If the form gets submitted, sends  server the message
form.addEventListener("submit", (e) => {
    e.preventDefault();
    const message = messageInput.value;
    append(`You:${message}`, 'right');
    socket.emit("send", message);
    messageInput.value = "";
});
