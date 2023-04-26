import { Schema, model } from 'mongoose';
const chatSchema = new Schema({
    chatId: {
        type: Number,
        required: true,
    },
    workStatus: {
        type: Boolean,
        default: false,
    },
});
const Chat = model('chat', chatSchema);
export default Chat;
