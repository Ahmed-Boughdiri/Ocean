
const saveUserData = function saveUserData({
    username="",
    email="",
    id=""
}) {
    try {
        localStorage.setItem(
            "OCEAN_USER_DATA", 
            JSON.stringify({
                username,
                email,
                id
            })
        );
        return {
            error: false
        }
    } catch(err) {
        return {
            error: "An Error Has Occured Please Try Again"
        }
    }
}

