
const handleLogin = async function handleLogin({
    email="",
    password=""
}) {
    try {
        const req = await fetch(
            "https://ocean-chat.onrender.com/user/login",
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
