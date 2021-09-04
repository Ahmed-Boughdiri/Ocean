
function removeOldRoomMessages() {
    roomMessgaes = [];
    const messagesComponent = document.querySelectorAll(".chatbox-message-container");
    messagesComponent.forEach(msgComponent =>{
        chatboxMessages.removeChild(msgComponent);
    });
}
