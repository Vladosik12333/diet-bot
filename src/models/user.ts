import { Schema, model, Document } from 'mongoose';

export interface IUser<ChatIdCollection = Schema.Types.ObjectId>
    extends Document {
    userId: number;
    chatIdCollection: ChatIdCollection;
    nick: string;
    name: string;
}

const userSchema = new Schema<IUser>({
    userId: {
        type: Number,
        default: -1,
    },
    chatIdCollection: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'chat',
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
