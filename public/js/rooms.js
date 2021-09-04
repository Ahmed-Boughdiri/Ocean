const socket = io("https://ocean-com.herokuapp.com/");

const roomsData = [];
let roomUsers = [];
const roomsIDs = [];
let roomID = "";

const emptyRoom = document.querySelector(".chatbox-empty");

const rooms = document.querySelector(".available-rooms");

// Get Rooms
const noRooms = document.querySelector(".no-available-rooms");
const roomsLoader = document.querySelector(".rooms-loader");

(async function() {
    try {
        showRoomsLoader();
        const { error: getTokenError, token } = getToken();
        if(getTokenError) {
            hideRoomsLoader();
            return;
        }
        const req = await fetch(
            "https://ocean-com.herokuapp.com/rooms/get",
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
        hideRoomsLoader();
        res.rooms.forEach((room, index) => {
            // Rendering Rooms
            renderRoom({
                isFirst: (index === 0),
                name: room.name,
                lastMessage: room?.messages[0]?.content,
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

let roomMessgaes = [];

const noRoomsSelectedYet = document.querySelector(".no-room-selected-yet");
let roomSelected = false;

rooms.addEventListener("click", async e =>{
    const { id } = getRoomID(e);
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
            "https://ocean-com.herokuapp.com/rooms/create",
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
        window.location.href = "https://ocean-com.herokuapp.com/";
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
        window.location.href = "https://ocean-com.herokuapp.com/login/";
    socket.emit(
        "chat-message", 
        { 
            room: roomID, 
            message,
            senderID: userID,
        }
    );
    hideEmptyRoom();
    roomMessgaes.push(message);
    renderMessage({
        message,
        sender: "user",
        isFirst: roomMessgaes ? true : false
    });
    chatboxInput.value = "";
    chatboxMessages.scrollTop = chatboxMessages.scrollHeight;
});

