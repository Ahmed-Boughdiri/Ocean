const socket = io("http://localhost:5000/");

const roomsData = [];
let roomUsers = [];
const roomsIDs = [];
let roomID = "";

function getUserID() {
    try {
        const result = localStorage.getItem("OCEAN_USER_DATA");
        const userData = JSON.parse(result);
        const userID = userData.id;
        return {
            error: false,
            userID
        }
    } catch(err) {
        return {
            error: "An Error Has Occured Please Try Again"
        }
    }
}

function getToken() {
    try {
        const token = localStorage.getItem("OCEAN_AUTH_TOKEN");
        return {
            error: false,
            token
        }
    } catch(err) {
        return {
            error: "An Error Has Occured Please Try Again Later"
        }
    }
}

const rooms = document.querySelector(".available-rooms");

function renderRoom({
    thumbnail="",
    name="",
    lastMessage="",
    isFirst=false,
    id=""
}) {
    const result = `
        <div class="room ${isFirst ?"first" : ""}" id="${id}">
            <div class="room-thumbnail">
                <img 
                    src="http://localhost:5000/${thumbnail}" 
                    alt="ocean-room-thumbnail"
                >
            </div>
            <div class="room-details">
                <h4 class="room-name">
                    ${name}
                </h4>
                <p class="room-last-message">
                    ${lastMessage ? lastMessage : "No Message Sent Yet"}
                </p>
            </div>
        </div>
    `;
    rooms.innerHTML += result;
}

// Get Rooms

const noRooms = document.querySelector(".no-available-rooms");
const roomsLoader = document.querySelector(".rooms-loader");
const hideRoomsLoader = () => roomsLoader.style.display = "none";

(async function() {
    try {
        roomsLoader.style.display = "flex";
        const { error: getTokenError, token } = getToken();
        if(getTokenError) {
            hideRoomsLoader();
            return;
        }
        const req = await fetch(
            "http://localhost:5000/rooms/get",
            {
                method: "POST",
                body: JSON.stringify({
                    token  
                }),
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                }
            }
        );
        const res = await req.json();
        if(req.status === 400 || req.status === 500) {
            hideRoomsLoader();
            return;
        }
        if(!res.rooms.length) {
            hideRoomsLoader();
            noRooms.style.display = "flex";
            return;
        }
        roomsLoader.style.display = "none";
        res.rooms.forEach((room, index) => {
            // Rendering Rooms
            renderRoom({
                isFirst: (index === 0),
                name: room.name,
                lastMessage: room.messages[0],
                thumbnail: room.thumbnail,
                id: room.id
            });
            const roomInfo = {
                users: room.users,
                messages: room.messages,
                id: room.id
            }
            roomsData.push(roomInfo);
            roomsIDs.push(room.id);
        });
    } catch(err) {
        return;
    }
})();

function getRoomID(e) {
    if(!e.target)
        return {
            id: null
        }
    if(roomsIDs.includes(e.target.id)) {
        return {
            id: e.target.id
        }
    } else if(e.target.parentElement.attributes.class.nodeValue === "room-details") {
        return {
            id: e.target.parentElement.parentElement.id
        }
    } else if(e.target.nodeName === "IMG") {
        return {
            id: e.target.parentElement.parentElement.id
        }
    } else {
        return {
            id: null
        }
    }
}

let roomMessgaes = [];
const messagesLoader = document.querySelector(".chatbox-messages-loader");
const emptyRoom = document.querySelector(".chatbox-empty");
const hideMessagesLoader = () => messagesLoader.style.display = "none";
const showEmtyRoom = () => emptyRoom.style.display = "flex";

const noRoomsSelectedYet = document.querySelector(".no-room-selected-yet");
let roomSelected = false;

function removeOldRoomMessages() {
    roomMessgaes = [];
    const messagesComponent = document.querySelectorAll(".chatbox-message-container");
    messagesComponent.forEach(msgComponent =>{
        chatboxMessages.removeChild(msgComponent);
    });
}

async function handleGetRoomMessages(roomID="") {
    try {
        removeOldRoomMessages();
        messagesLoader.style.display = "flex";
        const { error: getTokenError, token } = getToken();
        if(getTokenError) {
            hideMessagesLoader();
            throw getTokenError;
        }
        if(!roomID) {
            hideMessagesLoader();
            throw Error("Room ID Needs To Be Provided");
        }
        const req = await fetch(
            "http://localhost:5000/rooms/messages/get/",
            {
                method: "POST",
                body: JSON.stringify({
                    token: token,
                    roomID
                }),
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                }
            }
        );
        const res = await req.json();
        if(req.status === 400 || req.status === 500) {
            hideMessagesLoader();
            throw res.error;
        }
        if(!res.messages.length) {
            hideMessagesLoader();
            showEmtyRoom();
            return;
        } else {
            roomMessgaes = [...res.messages];
            roomMessgaes.forEach((message, index) =>{
                renderMessage({
                    isFirst: index === 0,
                    message: message.content,
                    sender: message.sender.name
                })
            });
            chatboxMessages.scrollTop = chatboxMessages.scrollHeight;
            hideMessagesLoader();
        }
    } catch(err) {
        throw err;
    }
}

rooms.addEventListener("click", async e =>{
    const { id } = getRoomID(e);
    console.log(id);
    const roomIndex = roomsData.findIndex(roomData => roomData.id === id);
    if(roomIndex === -1)
        return;
    roomUsers = [...roomsData[roomIndex].users];
    roomID = id;
    socket.emit("join-room", id);
    if(!roomSelected) {
        noRoomsSelectedYet.style.display = "none";
        roomSelected = true;
    }
    await handleGetRoomMessages(id);
});

// Creating New Room

const createNewRoomModal = document.querySelector(".add-new-room");
const createNewRoomButton = document.querySelectorAll(".navbar-option")[1];
const createNewRoomCancel = document.querySelector(".add-new-room-cancel");

const createNewRoomForm = document.querySelector(".add-new-room-form");
const roomName = document.querySelectorAll(".add-new-room-form input")[0];
const roomThumbnail = document.querySelectorAll(".add-new-room-form input")[1];


const createNewRoomFileInput = document.querySelector(".add-new-room-file-input>input");
const createNewRoomFileButton = document.querySelector(".add-new-room-file-input");

createNewRoomFileButton.addEventListener("click", e =>{
    createNewRoomFileInput.click();
});

createNewRoomButton.addEventListener("click", e =>{
    createNewRoomModal.style.display = "flex";
});

createNewRoomCancel.addEventListener("click", e =>{
    createNewRoomModal.style.display = "none"; 
});

createNewRoomForm.addEventListener("submit", async e =>{
    e.preventDefault();
    const form = new FormData();
    form.append("name", roomName.value);
    form.append("thumbnail", roomThumbnail.files[0]);
    const { error: getUserDataError, userID } = getUserID();
    if(getUserDataError)
        // TODO: HANDLING ERRORS
        return;
    form.append("userID", userID);
    const { error: getTokenError, token } = getToken();
    if(getTokenError)
        // TODO: HANDLING ERROS
        return;
    form.append("token", token);
    try {
        const req = await fetch(
            "http://localhost:5000/rooms/create",
            {
                method: "POST",
                body: form,
                
            }
        );
        const res = await req.json();
        noRooms.style.display = "none";
        roomsLoader.style.display = "none";
        renderRoom({
            name: res.name,
            lastMessage: res.messages[0],
            thumbnail: res.thumbnail,
            id: res.id
        });
        roomsIDs.push(res.id);
        if(req.status === 400 || req.status === 500)
            // TODO: HANDLING ERROS
            return;
        createNewRoomModal.style.display = "none";
        window.location.href = "http://localhost:5000/";
    } catch(err) {
        // TODO: HANDLING ERRORS
        console.log(JSON.stringify(err));
    }
});

// Room Users

const navbarRoomUsers = document.querySelectorAll(".navbar-option")[0];
const roomUsersComponent = document.querySelector(".room-users");
const roomUsersList = document.querySelector(".room-users-list");
const roomUsersCancel = document.querySelector(".room-users-header>i");

function renderRoomUser({
    thumbnail="",
    email="",
    name=""
}) {
    const result = `
        <div class="room-user">
            <div class="room-user-thumbnail">
                <img 
                    src="http://localhost:5000/${thumbnail}" 
                    alt=""
                >
            </div>
            <div class="room-user-details">
                <h4>${name}</h4>
                <p>${email}</p>
            </div>
        </div>
    `;
    roomUsersList.innerHTML += result;
}


roomUsersCancel.addEventListener("click", e =>{
    roomUsersComponent.style.display = "none";
});

navbarRoomUsers.addEventListener("click", e =>{
    roomUsersComponent.style.display = "flex";
    roomUsers.forEach(roomUser =>{
        renderRoomUser({
            email: roomUser.email,
            thumbnail: roomUser.thumbnail,
            name: roomUser.name
        });
    });
});

// Send Messages

const chatboxInput = document.querySelector(".chatbox-input>input");
const chatboxSendButton = document.querySelector(".chatbox-input>i"); 
const chatboxMessages = document.querySelector(".chatbox-messages");

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

console.log(chatboxMessages.scrollTop);
console.log(chatboxMessages.scrollHeight);

socket.on("sent-message", messageData =>{
    roomMessgaes.push(messageData.msg);
    renderMessage({
        message: messageData.msg,
        sender: messageData.sender,
        isFirst: roomMessgaes ? true : false
    });
    chatboxMessages.scrollTop = chatboxMessages.scrollHeight;
});


chatboxSendButton.addEventListener("click", e =>{
    const message = chatboxInput.value;
    const { error: getUserIDError, userID } = getUserID();
    if(getUserIDError)
        window.location.href = "http://localhost:5000/login/";
    socket.emit(
        "chat-message", 
        { 
            room: roomID, 
            message,
            senderID: userID,
        }
    );
    roomMessgaes.push(message);
    renderMessage({
        message,
        sender: "user",
        isFirst: roomMessgaes ? true : false
    });
    chatboxInput.value = "";
    chatboxMessages.scrollTop = chatboxMessages.scrollHeight;
});

