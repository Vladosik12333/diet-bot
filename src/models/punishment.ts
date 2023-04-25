import { Schema, model, Document } from 'mongoose';

export interface IPunishment extends Document {
    userIdCollection: Schema.Types.ObjectId;
    activity: number;
}

const punishmentSchema = new Schema<IPunishment>({
    userIdCollection: {
        type: Schema.Types.ObjectId,
        ref: 'user',
    },
    activity: {
        type: Number,
        required: true,
    },
});

const Punishment = model<IPunishment>('punishment', punishmentSchema);

export default Punishment;
