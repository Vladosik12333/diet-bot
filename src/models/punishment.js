"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var punishmentSchema = new mongoose_1.Schema({
    userIdCollection: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'user',
    },
    activity: {
        type: Number,
        required: true,
    },
});
var Punishment = (0, mongoose_1.model)('punishment', punishmentSchema);
exports.default = Punishment;
