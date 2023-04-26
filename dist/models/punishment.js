import { Schema, model } from 'mongoose';
const punishmentSchema = new Schema({
    userIdCollection: {
        type: Schema.Types.ObjectId,
        ref: 'user',
    },
    activity: {
        type: Number,
        required: true,
    },
});
const Punishment = model('punishment', punishmentSchema);
export default Punishment;
