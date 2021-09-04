
const renderRoomUser = function({
    thumbnail="",
    email="",
    name=""
}) {
    const result = `
        <div class="room-user">
            <div class="room-user-thumbnail">
                <img 
                    src="https://ocean-com.herokuapp.com/${thumbnail}" 
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

