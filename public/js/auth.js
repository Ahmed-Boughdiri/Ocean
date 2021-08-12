
const spinner = document.querySelector(".spinner");

function getToken() {
    try {
        return localStorage.getItem("OCEAN_AUTH_TOKEN");
    } catch(err) {
        return "";
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

(async function() {
    try {
        const token = getToken();
        if(!token)
            return window.location.href = "http://localhost:5000/login"
        else {
            const req = await fetch(
                "http://localhost:5000/user/token",
                {
                    method: "POST",
                    body: JSON.stringify({
                        token
                    }),
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                }
            );
            const res = await req.json();
            if(req.status === 400 || req.status === 500)
                return window.location.href = "http://localhost:5000/login"
            else {
                const { error: saveUserDataError } = saveUserData({
                    email: res.email,
                    username: res.username,
                    id: res.id
                });
                if(saveUserDataError)
                    return window.location.href = "http://localhost:5000/login"
                else  {
                    spinner.style.display = "none";
                }
            }
        }
    } catch(err) {
        window.location.href = "http://localhost:5000/login"
    }
})();