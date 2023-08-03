
const spinner = document.querySelector(".spinner");

(async function() {
    try {
        const { token } = getToken();
        if(!token)
            return window.location.href = "https://ocean-chat.onrender.com/login"
        else {
            const req = await fetch(
                "https://ocean-chat.onrender.com/user/token",
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
                return window.location.href = "https://ocean-chat.onrender.com/login"
            else {
                const { error: saveUserDataError } = saveUserData({
                    email: res.email,
                    username: res.username,
                    id: res.id
                });
                if(saveUserDataError)
                    return window.location.href = "https://ocean-chat.onrender.com/login"
                else  {
                    spinner.style.display = "none";
                }
            }
        }
    } catch(err) {
        window.location.href = "https://ocean-chat.onrender.com/login"
    }
})();
