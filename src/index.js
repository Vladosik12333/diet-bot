"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = require("./config");
var mongoose_1 = __importDefault(require("mongoose"));
var app_1 = __importDefault(require("./app"));
mongoose_1.default
    .connect(config_1.dbHost)
    .then(function () {
    console.log('Database connection successful');
    (0, app_1.default)();
})
    .catch(function (err) {
    console.log('Error with connect to database', err);
    process.exit(1);
});
