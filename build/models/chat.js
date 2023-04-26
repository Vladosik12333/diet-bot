"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var chatSchema = new mongoose_1.Schema({
    chatId: {
        type: Number,
        required: true,
    },
    workStatus: {
        type: Boolean,
        default: false,
    },
});
var Chat = (0, mongoose_1.model)('chat', chatSchema);
exports.default = Chat;
