
const navMenu = document.querySelector(".navbar-menu");
const navMenuButton = document.querySelector(".navbar-menu-button");
let navMenuDisplayed = false;

navMenuButton.addEventListener("click", e => {
    if(!navMenuDisplayed) {
        navMenu.style.display = "block";
        navMenuDisplayed = true;
    } else {
        navMenu.style.display = "none";
        navMenuDisplayed = false;
    }
});

const showAvailableRoomsOption = document.querySelectorAll(".navbar-menu-item")[3];
const showAvailableRoomsOptionName = showAvailableRoomsOption.querySelector("h4");
const availableRooms = document.querySelector("#rooms");
let availableRoomsDisplayed = false;

showAvailableRoomsOption.addEventListener("click", e => {
    if(!availableRoomsDisplayed) {
        availableRooms.style.left = "0";
        showAvailableRoomsOptionName.innerText = "Hide Available Rooms";
        navMenu.style.display = "none";
        navMenuDisplayed = false;
        availableRoomsDisplayed = true;
    } else {
        availableRooms.style.left = "-100vw";
        showAvailableRoomsOptionName.innerText = "Show Available Rooms";
        navMenu.style.display = "none";
        navMenuDisplayed = false;
        availableRoomsDisplayed = false;
    }
})
