"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var dietBot_1 = require("../constants/dietBot");
var user_1 = __importDefault(require("../models/user"));
var poll_1 = __importDefault(require("../models/poll"));
var chat_1 = __importDefault(require("../models/chat"));
var DietBotService = /** @class */ (function () {
    function DietBotService(bot) {
        var _this = this;
        this.getFoodReport = function (msg) { return __awaiter(_this, void 0, void 0, function () {
            var from, chat, userArg, user, messageOfPoll;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        from = (_a = msg.update.message) === null || _a === void 0 ? void 0 : _a.from;
                        chat = (_b = msg.update.message) === null || _b === void 0 ? void 0 : _b.chat;
                        userArg = {
                            chatId: chat === null || chat === void 0 ? void 0 : chat.id,
                            userId: from === null || from === void 0 ? void 0 : from.id,
                            nick: from === null || from === void 0 ? void 0 : from.username,
                            firstName: from === null || from === void 0 ? void 0 : from.first_name,
                            lastName: from === null || from === void 0 ? void 0 : from.last_name,
                        };
                        return [4 /*yield*/, this.getUser(userArg)];
                    case 1:
                        user = _c.sent();
                        return [4 /*yield*/, this.bot.api.sendMessage(user === null || user === void 0 ? void 0 : user.chatIdCollection.chatId, dietBot_1.REPORT.PENDING(user === null || user === void 0 ? void 0 : user.name))];
                    case 2:
                        _c.sent();
                        return [4 /*yield*/, this.bot.api.sendPoll(user.chatIdCollection.chatId, dietBot_1.POLL.QUESTION, [dietBot_1.POLL.OPTION_1, dietBot_1.POLL.OPTION_2], {
                                is_anonymous: false,
                            })];
                    case 3:
                        messageOfPoll = _c.sent();
                        return [4 /*yield*/, poll_1.default.create({
                                userIdCollection: user._id,
                                messageIdOfPoll: messageOfPoll.message_id,
                                pollId: messageOfPoll.poll.id,
                            })];
                    case 4:
                        _c.sent();
                        return [2 /*return*/];
                }
            });
        }); };
        this.answerOnFoodReport = function (msg) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                console.log(msg);
                return [2 /*return*/];
            });
        }); };
        this.setTimeOfPhysicalPunishment = function (msg) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                console.log(msg);
                return [2 /*return*/];
            });
        }); };
        this.checkChangingMyRights = function (msg) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                console.log(msg);
                return [2 /*return*/];
            });
        }); };
        this.onFirstBotMessage = function (msg) { return __awaiter(_this, void 0, void 0, function () {
            var id, chatId;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        id = (_a = msg.update.my_chat_member) === null || _a === void 0 ? void 0 : _a.chat.id;
                        console.log(id);
                        return [4 /*yield*/, chat_1.default.create({
                                chatId: id,
                            })];
                    case 1:
                        chatId = (_b.sent()).chatId;
                        console.log(chatId);
                        return [4 /*yield*/, this.bot.api.sendMessage(chatId, dietBot_1.RULES)];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, this.bot.api.sendMessage(chatId, dietBot_1.GREETING_MESSAGE)];
                    case 3:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        }); };
        this.messageOnWrapperError = function (msg, error) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                console.log(msg);
                return [2 /*return*/];
            });
        }); };
        this.checkWorkBotStatus = function (msg) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                console.log(msg);
                return [2 /*return*/];
            });
        }); };
        this.getUser = function (msgUser) { return __awaiter(_this, void 0, void 0, function () {
            var users, chat, user, chat_2, newUser, user_2;
            var _a, _b, _c, _d, _e;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0: return [4 /*yield*/, user_1.default.find({
                            userId: msgUser.userId,
                        }).populate('chatIdCollection')];
                    case 1:
                        users = _f.sent();
                        return [4 /*yield*/, chat_1.default.findOne({ chatId: msgUser.chatId })];
                    case 2:
                        chat = _f.sent();
                        user = users.find(function (user) {
                            return (user === null || user === void 0 ? void 0 : user.chatIdCollection._id.toString()) === (chat === null || chat === void 0 ? void 0 : chat._id.toString());
                        });
                        if (!!user) return [3 /*break*/, 7];
                        return [4 /*yield*/, chat_1.default.findOne({ chatId: msgUser.chatId })];
                    case 3:
                        chat_2 = _f.sent();
                        if (!!chat_2) return [3 /*break*/, 5];
                        return [4 /*yield*/, chat_1.default.create({
                                chatId: msgUser.chatId,
                                workStatus: true,
                            })];
                    case 4:
                        chat_2 = _f.sent();
                        _f.label = 5;
                    case 5: return [4 /*yield*/, user_1.default.create({
                            chatIdCollection: chat_2._id,
                            userId: (_a = msgUser.userId) !== null && _a !== void 0 ? _a : -1,
                            nick: (_c = (_b = msgUser.nick) === null || _b === void 0 ? void 0 : _b.trimEnd()) !== null && _c !== void 0 ? _c : '',
                            name: "".concat((_d = msgUser.firstName) !== null && _d !== void 0 ? _d : '', " ").concat((_e = msgUser.lastName) !== null && _e !== void 0 ? _e : '').trimEnd(),
                        })];
                    case 6:
                        newUser = _f.sent();
                        user_2 = newUser;
                        user_2.chatIdCollection = chat_2;
                        return [2 /*return*/, user_2];
                    case 7: return [2 /*return*/, user];
                }
            });
        }); };
        this.bot = bot;
    }
    return DietBotService;
}());
exports.default = DietBotService;
