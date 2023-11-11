import { UserModel } from "../Models/user.model";

export async function registerService(userName: string, email: string, password: string) {
    // Check userName not exist
    const isExist = await UserModel.findOne({ userName });
    if (isExist) return {isSuccess: false, message: 'This userName already exists', status: 400};

    const newUser = new UserModel({
        userName,
        email,
        password
    });

    const data = await newUser.save();

    return{
        isSuccess: true,
        data,
        message: 'User created successfully.',
        status: 201
    }

}

export async function getAllUsersService() {
    const data = await UserModel.find({});

    return{
        isSuccess: true,
        data,
        message: 'Get all users successfully.',
        status: 201
    }

}

