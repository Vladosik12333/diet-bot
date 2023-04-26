"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var userSchema = new mongoose_1.Schema({
    userId: {
        type: Number,
        default: -1,
    },
    chatIdCollection: {
        type: mongoose_1.Schema.Types.ObjectId,
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
var User = (0, mongoose_1.model)('user', userSchema);
exports.default = User;
