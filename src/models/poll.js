"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var pollSchema = new mongoose_1.Schema({
    userIdCollection: {
        type: mongoose_1.Schema.Types.ObjectId,
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
var Poll = (0, mongoose_1.model)('poll', pollSchema);
exports.default = Poll;
