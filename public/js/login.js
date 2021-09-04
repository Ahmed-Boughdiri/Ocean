
const email = document.querySelector("#email-input");
const password = document.querySelector("#password-input");

const loginButton = document.querySelector(".login-form>button");

const loginError = document.querySelector(".login-error");
const loginErrorMsg = loginError.querySelector("h4");

const loginErrorCancel = loginError.querySelector("i");

loginErrorCancel.querySelector("click", e =>{
    loginError.style.display = "none";
});

loginButton.addEventListener("click", async e =>{
    const { error: dataError } = validateLoginData({
        email: email.value,
        password: password.value
    });
    if(dataError)
        showLoginError(dataError);
    else {
        const { error: handleLoginError, data } = await handleLogin({
            email: email.value,
            password: password.value
        });
        if(handleLoginError)
            showLoginError(handleLoginError);
        else {
            const { error: saveUserDataError } = saveUserData({
                email: email.value,
                username: data.username,
                id: data.id
            });
            if(saveUserDataError)
                showLoginError(saveUserDataError);
            else {
                const { error: saveTokenError } = saveToken(data.token);
                if(saveTokenError)
                    showLoginError(saveTokenError);
                else 
                    window.location.href = "https://ocean-com.herokuapp.com/"
            }
        }
    }
});
