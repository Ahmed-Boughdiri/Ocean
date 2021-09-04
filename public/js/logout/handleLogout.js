
const handleLogout = function handleLogout() {
    try {
        localStorage.removeItem("OCEAN_AUTH_TOKEN");
        localStorage.removeItem("OCEAN_USER_DATA");
        window.location.href = "http://localhost:5000/";
    } catch(err) {
        return;
    }
}
