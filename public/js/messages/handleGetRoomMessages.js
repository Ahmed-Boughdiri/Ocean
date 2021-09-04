
const handleGetRoomMessages = async function(roomID="") {
    try {
        showMessagesLoader();
        removeOldRoomMessages();
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
            "https://ocean-com.herokuapp.com/rooms/messages/get/",
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
            hideMessagesLoader();
            hideEmptyRoom();
            roomMessgaes = [...res.messages];
            roomMessgaes.forEach((message, index) =>{
                renderMessage({
                    isFirst: index === 0,
                    message: message.content,
                    sender: message.sender.name
                })
            });
            chatboxMessages.scrollTop = chatboxMessages.scrollHeight;
        }
    } catch(err) {
        throw err;
    }
}

