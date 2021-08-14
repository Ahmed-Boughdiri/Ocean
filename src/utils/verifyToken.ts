import jwt from "jsonwebtoken";

export default async function(token: String) {
    try {
        if(!token)
            return {
                error: "Token Needs To Be Provided"
            }
        const validToken = await jwt.verify(
            token as string, 
            process.env.JWT_SECRET || ""
        );
        if(!validToken)
            return {
                error: "Invalid Token"
            }
        return {
            error: false
        }
    } catch(err) {
        return {
            error: "An Error Has Occured Please Try Again Later"
        }
    }
}
