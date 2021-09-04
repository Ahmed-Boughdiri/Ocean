
const username = document.querySelector("#username-input");
const email = document.querySelector("#email-input");
const password = document.querySelector("#password-input");
const confirmPassword = document.querySelector("#confirm-password-input");

const signupButton = document.querySelector(".signup-form>button");

const signupError = document.querySelector(".signup-error");
const signupErrorMessage = signupError.querySelector("h4");
const signupErrorCancel = signupError.querySelector("i");

// Hide Error
signupErrorCancel.addEventListener("click", e =>{
    signupError.style.display = "none";
});

// Handle Sign Up
signupButton.addEventListener("click", async e =>{
    const { error } = validateSignupData({
        username: username.value,
        email: email.value,
        password: password.value,
        confirmPassword: confirmPassword.value
    });
    if(error)
        showSignupError(error)
    else {
        const { error: signupError, data } = await handleSignUp({
            username: username.value,
            email: email.value,
            password: password.value
        });
        if(signupError)
            showSignupError(signupError);
        else {
            const { error: saveUserError } = saveUserData({
                username: username.value,
                email: email.value,
                id: data.id
            });
            if(saveUserError)
                showSignupError(saveUserError);
            else {
                const { error: saveTokenError } = saveToken(data.token);   
                if(saveTokenError) 
                    showSignupError(saveTokenError);
                else 
                    window.location.href = "http://localhost:5000/";
            }
        }
    }
})
