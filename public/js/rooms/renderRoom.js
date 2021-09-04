
const renderRoom = function({
    thumbnail="",
    name="",
    lastMessage="",
    isFirst=false,
    id=""
}) {
    const result = `
        <div class="room ${isFirst ?"first" : ""}" id="${id}">
            <div 
                class="room-thumbnail"
            >
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

