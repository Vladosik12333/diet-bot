import { Schema, model, Document } from 'mongoose';
import { IUser } from './user';

export interface IPoll<UserIdCollection = Schema.Types.ObjectId>
    extends Document {
    userIdCollection: UserIdCollection;
    pollId: string;
    messageIdOfPoll: number;
}

const pollSchema = new Schema<IPoll>({
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

const Poll = model<IPoll>('poll', pollSchema);

export default Poll;
