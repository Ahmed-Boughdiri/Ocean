
const uploadUserThumbnailModal = document.querySelector(".upload-user-thumbnail");
const uploadUserThumbnailBtn = document.querySelectorAll(".more-option")[1];
const uploadUserThumbnailCancel = document.querySelector(".upload-user-thumbnail-header>i");

uploadUserThumbnailBtn.addEventListener("click", e =>{
    uploadUserThumbnailModal.style.display = "flex";
});

uploadUserThumbnailCancel.addEventListener("click", e =>{
    uploadUserThumbnailModal.style.display = "none";
});

const uploadUserThumbnailInputBtn = document.querySelector(".upload-user-thumbnail-wrapper>button");
const uploadUserThumbnailInput = document.querySelector(".upload-user-thumbnail-wrapper>input");
const uploadUserThumbnailFrom = document.querySelector(".upload-user-thumbnail-form");

uploadUserThumbnailInputBtn.addEventListener("click", e =>{
    e.preventDefault();
    uploadUserThumbnailInput.click();
});

uploadUserThumbnailFrom.addEventListener("submit", async e =>{
    try {
        e.preventDefault();
        const form = new FormData();
        form.append("thumbnail", uploadUserThumbnailInput.files[0]);
        const { error: getUserIDError, userID } = getUserID();
        if(getUserIDError)
            return;
        form.append("userID", userID);
        const req = await fetch(
            "https://ocean-com.herokuapp.com/users/upload/thumbnail/",
            {
                method: "POST",
                body: form
            }
        );
        if(req.status === 400 || req.status === 500)
            return;
        window.location.href = "https://ocean-com.herokuapp.com/"
    } catch(err) {
        return;
    }
});

