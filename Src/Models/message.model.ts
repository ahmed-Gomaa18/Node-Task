import mongoose, {Schema} from "mongoose";

const messageSchema = new mongoose.Schema({
    senderId: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
    senderUsername: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true
    },
    room: {
        type: String,
        required: true
    }
},
{
    timestamps: true
});

export const messageModel = mongoose.model("message", messageSchema);