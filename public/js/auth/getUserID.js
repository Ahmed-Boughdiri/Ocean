
const getUserID = function() {
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
