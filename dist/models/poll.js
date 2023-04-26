import { Schema, model } from 'mongoose';
const pollSchema = new Schema({
    userIdCollection: {
        type: Schema.Types.ObjectId,
        ref: 'user',
    },
    pollId: {
        type: String,
        default: '',
    },
    messageIdOfPoll: {
        type: Number,
        required: true,
    },
});
const Poll = model('poll', pollSchema);
export default Poll;
