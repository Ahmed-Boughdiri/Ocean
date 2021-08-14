
const moreOptionsBtn = document.querySelectorAll(".navbar-option")[2];
const moreOptionsContainer = document.querySelector(".more-options");
const moreOptionsCancel = document.querySelector(".more-options-header>i");

moreOptionsBtn.addEventListener("click", e =>{
    moreOptionsContainer.style.display = "flex";
});

moreOptionsCancel.addEventListener("click", e =>{
    moreOptionsContainer.style.display = "none";
});
