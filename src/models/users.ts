import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
    userId: number;
    chatId: number;
    nick: string;
    name: string;
}

const userSchema = new Schema<IUser>({
    userId: {
        type: Number,
        default: -1,
    },
    chatId: {
        type: Number,
        required: true,
    },
    nick: {
        type: String,
        default: '',
    },
    name: {
        type: String,
        default: '',
    },
});

const User = model<IUser>('user', userSchema);

export default User;
