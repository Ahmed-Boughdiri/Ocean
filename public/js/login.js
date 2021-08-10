
const email = document.querySelector("#email-input");
const password = document.querySelector("#password-input");

const loginButton = document.querySelector(".login-form>button");

function validateData({
    email="",
    password=""
}) {
    const emailPattern = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
    // Validating Email
    if(!email)
        return {
            error: "Email Needs To Be Provided"
        }
    else if(!email.match(emailPattern))
        return {
            error: "Invalid Email"
        }
    // Validating Password
    if(!password)
        return {
            error: "Password Needs To Be Provided"
        }
    else if(password.length < 8)
        return {
            error: "Password Needs To Be More Than 8 Characters"
        }
    return {
        error: false
    }
}

const loginError = document.querySelector(".login-error");
const loginErrorMsg = loginError.querySelector("h4");

const loginErrorCancel = loginError.querySelector("i");

loginErrorCancel.querySelector("click", e =>{
    loginError.style.display = "none";
});

function showError(msg="") {
    loginError.style.display = "flex";
    loginErrorMsg.innerText = msg;
}

async function handleLogin({
    email="",
    password=""
}) {
    try {
        const req = await fetch(
            "http://localhost:5000/user/login",
            {
                method: "POST",
                body: JSON.stringify({
                    email,
                    password
                }),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }
        );
        const res = await req.json();
        if(req.status === 400 || req.status === 500)
            return {
                error: res.error
            }
        else
            return {
                error: false,
                data: res
            }
    } catch(err) {
        return {
            error: err.response?.data?.error ||
                "An Error Has Occured Please Try Again"
        }
    }
}

function saveUserData({
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

function saveToken(token="") {
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

loginButton.addEventListener("click", async e =>{
    const { error: dataError } = validateData({
        email: email.value,
        password: password.value
    });
    if(dataError)
        showError(dataError);
    else {
        const { error: handleLoginError, data } = await handleLogin({
            email: email.value,
            password: password.value
        });
        if(handleLoginError)
            showError(handleLoginError);
        else {
            const { error: saveUserDataError } = saveUserData({
                email: email.value,
                username: data.username,
                id: data.id
            });
            if(saveUserDataError)
                showError(saveUserDataError);
            else {
                const { error: saveTokenError } = saveToken(data.token);
                if(saveTokenError)
                    showError(saveTokenError);
                else 
                    window.location.href = "http://localhost:5000/"
            }
        }
    }
});
