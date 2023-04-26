"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.domain = exports.dbHost = exports.port = exports.token = void 0;
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
var _a = process.env, _b = _a.TOKEN, token = _b === void 0 ? '' : _b, _c = _a.PORT, port = _c === void 0 ? 3333 : _c, _d = _a.DB_HOST, dbHost = _d === void 0 ? '' : _d, _e = _a.DOMAIN, domain = _e === void 0 ? '' : _e;
exports.token = token;
exports.port = port;
exports.dbHost = dbHost;
exports.domain = domain;
