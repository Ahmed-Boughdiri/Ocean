
const saveToken = function saveToken(token="") {
    try {
        localStorage.setItem("OCEAN_AUTH_TOKEN", token);
        return {
            error: false
        }
    } catch(err) {
        return {
            error: "An Error Has Occured Please Try Again"
        }
    }
}
