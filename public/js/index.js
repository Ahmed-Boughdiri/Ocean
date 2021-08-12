const socket = io("http://localhost:5000/");
const rooms = [
    {
        roomID: "1",
        messages: [],
        dom: document.createElement("div")
    },
    {
        roomID: "2",
        messages: [],
        dom: document.createElement("div")
    },
];
let joined_room;

const chatboxInput = document.querySelector(".chatbox-input>input");
const chatboxSendButton = document.querySelector(".chatbox-input>i"); 
const chatboxMessages = document.querySelector(".chatbox-messages");

socket.on("sent-message", message =>{
    const roomIndex = rooms.findIndex(
        room => 
            room.roomID === joined_room.roomID
    );
    if(roomIndex != -1) {
        rooms[roomIndex].messages.push(message);
        renderMessage({
            message,
            sender: "Unknown",
            isFirst: (rooms[roomIndex].messages) ? true : false
        })
    }
});

function renderMessage({
    sender,
    message,
    isFirst=false
}) {
    const component = `
        <div class="chatbox-message-container ${(sender === "user") && "sent-by-user"} ${isFirst && "first"}">
            ${
                (sender !== "user") ?
                `<div class="chatbox-message-arrow ${(sender === "user") && "sent-by-user"}"></div>` : 
                ""
            }
            <div class="chatbox-message ${(sender === "user") && "sent-by-user"}">
                <h3 class="chatbox-message-owner">
                    ${(sender === "user") ? "You" : sender}
                </h3>
                <p class="chatbox-message-content">
                    ${message}
                </p>
            </div>
            ${
                (sender === "user") ?
                `<div class="chatbox-message-arrow ${(sender === "user") && "sent-by-user"}"></div>` : 
                ""
            }
        </div>
    `;
    chatboxMessages.innerHTML += component;
}

rooms.forEach(room =>{
    room.dom.addEventListener("click", e =>{
        socket.emit("join-room", room.roomID);
        joined_room = rooms.filter(
            roomData => 
                roomData.roomID === room.roomID
        )[0];
    });
});

chatboxSendButton.addEventListener("click", e =>{
    const message = chatboxInput.value;
    socket.emit(
        "chat-message", 
        { 
            room: joined_room.roomID, 
            message 
        }
    );
    const roomIndex = rooms.findIndex(room => room.roomID === joined_room.roomID);
    if(roomIndex != -1) {
        rooms[roomIndex].messages.push(message);
        renderMessage({
            message,
            sender: "user",
            isFirst: (rooms[roomIndex].messages) ? true : false
        });
        chatboxInput.value = "";
    }
});
