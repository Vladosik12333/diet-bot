"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.token = void 0;
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
var _a = process.env.TOKEN, token = _a === void 0 ? '' : _a;
exports.token = token;
