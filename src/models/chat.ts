import { Schema, model, Document } from 'mongoose';

export interface IChat extends Document {
    chatId: number;
    workStatus: boolean;
}

const chatSchema = new Schema<IChat>({
    chatId: {
        type: Number,
        required: true,
    },
    workStatus: {
        type: Boolean,
        default: false,
    },
});

const Chat = model<IChat>('chat', chatSchema);

export default Chat;
