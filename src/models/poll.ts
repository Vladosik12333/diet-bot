import { Schema, model, Document } from 'mongoose';

export interface IPoll extends Document {
    userIdCollection: Schema.Types.ObjectId;
    pollId: string;
    messageOfPullId: number;
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
    messageOfPullId: {
        type: Number,
        required: true,
    },
});

const Poll = model<IPoll>('poll', pollSchema);

export default Poll;
