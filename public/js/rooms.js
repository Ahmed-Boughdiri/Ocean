
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
    console.log(`http://localhost:5000/${thumbnail}`);
    const result = `
        <div class="room ${isFirst && "first"}">
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
            renderRoom({
                isFirst: (index === 0),
                name: room.name,
                lastMessage: room.messages[0],
                thumbnail: room.thumbnail
            });
        });
    } catch(err) {
        return;
    }
})();

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
        console.log("Result: ", res);
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
