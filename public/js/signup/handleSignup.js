
async function handleSignUp({
    username="",
    email="",
    password="",
}) {
    console.log("Sign up Started!!!")
    try {
        const req = await fetch(
            "https://ocean-chat.onrender.com/user/create",
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

