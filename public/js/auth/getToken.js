
const getToken = function() {
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

