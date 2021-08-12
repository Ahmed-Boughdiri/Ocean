
const roomsData = [];
let roomUsers = [];
const roomsIDs = [];

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
    isFirst=false
}) {
    const id = uuid.v4();
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
    return {
        id
    }
}

// Get Rooms
(async function() {
    try {
        const { error: getTokenError, token } = getToken();
        if(getTokenError)
            return;
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
        if(req.status === 400 || req.status === 500)
            return;
        res.rooms.forEach((room, index) => {
            // Rendering Rooms
            const { id } = renderRoom({
                isFirst: (index === 0),
                name: room.name,
                lastMessage: room.messages[0],
                thumbnail: room.thumbnail
            });
            const roomInfo = {
                users: room.users,
                messages: room.messages,
                id
            }
            roomsData.push(roomInfo);
            roomsIDs.push(id);
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

rooms.addEventListener("click", e =>{
    const { id } = getRoomID(e);
    const roomIndex = roomsData.findIndex(roomData => roomData.id === id);
    if(roomIndex === -1)
        return;
    roomUsers = [...roomsData[roomIndex].users];
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
        renderRoom({
            name: res.name,
            lastMessage: res.messages[0],
            thumbnail: res.thumbnail
        });
        if(req.status === 400 || req.status === 500)
            // TODO: HANDLING ERROS
            return;
        createNewRoomModal.style.display = "none";
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
                    src="${thumbnail}" 
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
