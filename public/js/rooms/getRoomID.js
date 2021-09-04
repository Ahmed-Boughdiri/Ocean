
const getRoomID = function(e) {
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
