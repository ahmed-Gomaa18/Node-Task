import mongoose, {Document, Schema} from "mongoose";
import bcrypt, {compare} from 'bcrypt';

//checkPasswordIsValid(password: string): boolean;

interface IUser extends Document{
    userName: String,
    email: String,
    password: String,
    checkPasswordIsValid(password: string): boolean;

}

const userSchema: Schema<IUser> = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    }
},
{
    timestamps: true
});

//Check Password Validate
userSchema.methods.checkPasswordIsValid = async function (password: string) : Promise<boolean> {
    return await compare(password, this.password);
};
// Hash Password Pre Save
userSchema.pre('save', async function (next) {
    this.password = await bcrypt.hash(this.password.toString() , parseInt(process.env.SALT_ROUND));
    next();
});


export const UserModel = mongoose.model<IUser>('user', userSchema);