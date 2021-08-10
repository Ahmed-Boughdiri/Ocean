
const username = document.querySelector("#username-input");
const email = document.querySelector("#email-input");
const password = document.querySelector("#password-input");
const confirmPassword = document.querySelector("#confirm-password-input");

const signupButton = document.querySelector(".signup-form>button");

const signupError = document.querySelector(".signup-error");
const signupErrorMessage = signupError.querySelector("h4");
const signupErrorCancel = signupError.querySelector("i");

function validateData({
    username="",
    email="",
    password="",
    confirmPassword=""
}) {
    // Validate Username
    if(!username)
        return {
            error: "Username Needs To Be Provided"
        }
    else if(username.length < 3)
        return {
            error: "User Needs To Be More Than 3 Characters"
        }
    // Validate email
    const emailPattern = 
        /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
    if(!email)
        return {
            error: "Email Must Be Provided"
        }
    else if(!email.match(emailPattern)) 
        return {
            error: "Invalid Email Address"
        }
    // Validate Password
    if(!password)
        return {
            error: "Password Needs To Be Provided"
        }
    else if(password.length < 8 )
        return {
            error: "Password Needs To Be More Than 8 Characters"
        }
    // Validate Confirm Password
    if(!confirmPassword)
        return {
            error: "Confirm Password Needs To Be Provided"
        }
    else if(confirmPassword.length < 8)
        return {
            error: "Confirm Password Needs To Be More Than 8 Characters"
        }
    // Confirm Password
    if(password !== confirmPassword)
        return {
            error: "Password Does Not Match"
        }
    return {
        error: false
    }
}

async function handleSignUp({
    username="",
    email="",
    password="",
}) {
    try {
        const req = await fetch(
            "http://localhost:5000/user/create",
            {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username,
                    email,
                    password
                })
            }
        );
        const res = await req.json();
        if(req.status === 400 || req.status === 500)
            return {
                error: req.error ||
                    "An Error Has Occured Please Try Again"
            }
        return {
            data: res
        }
    } catch(err) {
        return {
            error: err.response?.data.error ||
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

function showError(msg="") {
    signupError.style.display = "flex";
    signupErrorMessage.innerText = msg;
}

// Hide Error
signupErrorCancel.addEventListener("click", e =>{
    signupError.style.display = "none";
});

// Handle Sign Up
signupButton.addEventListener("click", async e =>{
    const { error } = validateData({
        username: username.value,
        email: email.value,
        password: password.value,
        confirmPassword: confirmPassword.value
    });
    if(error)
        showError(error)
    else {
        const { error: signupError, data } = await handleSignUp({
            username: username.value,
            email: email.value,
            password: password.value
        });
        if(signupError)
            showError(signupError);
        else {
            const { error: saveUserError } = saveUserData({
                username: username.value,
                email: email.value,
                id: data.id
            });
            if(saveUserError)
                showError(saveUserError);
            else {
                const { error: saveTokenError } = saveToken(data.token);   
                if(saveTokenError) 
                    showError(saveTokenError);
                else 
                    window.location.href = "http://localhost:5000/";
            }
        }
    }
})
