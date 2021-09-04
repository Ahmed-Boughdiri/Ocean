
const validateSignupData = function validateSignupData({
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

