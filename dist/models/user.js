import { Schema, model } from 'mongoose';
const userSchema = new Schema({
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
const User = model('user', userSchema);
export default User;
