import bcrypt from "bcrypt";

export default async function(password: String): Promise<String> {
    const salt = await bcrypt.genSalt(10);
    const encryptedPassword = await bcrypt.hash(password as string, salt);
    return encryptedPassword;
}
