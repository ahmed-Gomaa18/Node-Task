import { UserModel } from "../Models/user.model";
import { sign as jwtSign } from "jsonwebtoken";

export async function loginService(userName: string, password: string, rememberMe: boolean) {
    const user = await UserModel.findOne({ userName });
    if (!user) return {isSuccess: false, message: 'userName or password invalid', status: 400};

    const match = await user.checkPasswordIsValid(password);
    if (!match) return {isSuccess: false, message: 'userName or password invalid', status: 400}; 

    // Check rememberMe
    let expiresIn = "24h";
    if (rememberMe) {
        expiresIn = "7d";
    }
    const TokenJWT = await jwtSign(
        { userId: user._id, userName: user.userName },
        process.env.TOKEN_SIGNATURE,
        { expiresIn }
    );

    return{
        isSuccess: true,
        data: {
            token: TokenJWT
        },
        message: 'User Login successfully.',
        status: 200
    };

}