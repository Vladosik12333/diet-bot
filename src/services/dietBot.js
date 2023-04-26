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
var punishment_1 = __importDefault(require("../models/punishment"));
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
            var pollByBot, poll, messageIdOfPoll, pollId, user, _a, chat, nick, name, userId, chatId, finishPoll, punishment, nameToResponse, activity, messageOfPunishment;
            var _this = this;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        pollByBot = msg.update.poll_answer;
                        return [4 /*yield*/, poll_1.default.aggregate([
                                {
                                    $match: {
                                        pollId: pollByBot === null || pollByBot === void 0 ? void 0 : pollByBot.poll_id,
                                    },
                                },
                                {
                                    $lookup: {
                                        from: 'users',
                                        localField: 'userIdCollection',
                                        foreignField: '_id',
                                        as: 'user',
                                        pipeline: [
                                            {
                                                $lookup: {
                                                    from: 'chats',
                                                    localField: 'chatIdCollection',
                                                    foreignField: '_id',
                                                    as: 'chat',
                                                },
                                            },
                                        ],
                                    },
                                },
                            ])];
                    case 1:
                        poll = (_c.sent())[0];
                        if (!poll)
                            throw new Error(dietBot_1.CANNOT_FIND_POLL);
                        messageIdOfPoll = poll.messageIdOfPoll, pollId = poll._id, user = poll.user;
                        _a = user[0], chat = _a.chat, nick = _a.nick, name = _a.name, userId = _a._id;
                        return [4 /*yield*/, this.checkWorkBotStatus(chat[0].chatId)];
                    case 2:
                        if (!(_c.sent()))
                            return [2 /*return*/];
                        chatId = chat[0].chatId;
                        finishPoll = function (approved) { return __awaiter(_this, void 0, void 0, function () {
                            var _a, _b;
                            return __generator(this, function (_c) {
                                switch (_c.label) {
                                    case 0: return [4 /*yield*/, poll_1.default.deleteOne({ _id: pollId })];
                                    case 1:
                                        _c.sent();
                                        return [4 /*yield*/, this.bot.api.deleteMessage(chatId, messageIdOfPoll)];
                                    case 2:
                                        _c.sent();
                                        return [4 /*yield*/, this.bot.api.sendMessage(chatId, approved
                                                ? dietBot_1.REPORT.APPROVED(nick, (_a = pollByBot === null || pollByBot === void 0 ? void 0 : pollByBot.user.username) !== null && _a !== void 0 ? _a : '')
                                                : dietBot_1.REPORT.REJECTED(nick, (_b = pollByBot === null || pollByBot === void 0 ? void 0 : pollByBot.user.username) !== null && _b !== void 0 ? _b : ''))];
                                    case 3:
                                        _c.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); };
                        if (!((pollByBot === null || pollByBot === void 0 ? void 0 : pollByBot.option_ids[0]) === 0)) return [3 /*break*/, 4];
                        return [4 /*yield*/, finishPoll(true)];
                    case 3:
                        _c.sent();
                        return [3 /*break*/, 9];
                    case 4: return [4 /*yield*/, finishPoll(false)];
                    case 5:
                        _c.sent();
                        return [4 /*yield*/, punishment_1.default.findOne({
                                userIdCollection: userId,
                            })];
                    case 6:
                        punishment = _c.sent();
                        nameToResponse = name ? name : nick;
                        activity = (_b = punishment === null || punishment === void 0 ? void 0 : punishment.activity) !== null && _b !== void 0 ? _b : 100;
                        return [4 /*yield*/, this.bot.api.sendMessage(chatId, dietBot_1.REPORT.MESSAGE_AFTER_APPROVED(nameToResponse, activity))];
                    case 7:
                        messageOfPunishment = _c.sent();
                        return [4 /*yield*/, this.bot.api.pinChatMessage(chatId, messageOfPunishment.message_id)];
                    case 8:
                        _c.sent();
                        _c.label = 9;
                    case 9: return [2 /*return*/];
                }
            });
        }); };
        this.setTimeOfPhysicalPunishment = function (msg) { return __awaiter(_this, void 0, void 0, function () {
            var id, from, text, userArg, user, activity, oldPunishment;
            var _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        id = (_a = msg.update.message) === null || _a === void 0 ? void 0 : _a.chat.id;
                        from = (_b = msg.update.message) === null || _b === void 0 ? void 0 : _b.from;
                        text = (_c = msg.update.message) === null || _c === void 0 ? void 0 : _c.text;
                        userArg = {
                            chatId: id,
                            userId: from === null || from === void 0 ? void 0 : from.id,
                            nick: from === null || from === void 0 ? void 0 : from.username,
                            firstName: from === null || from === void 0 ? void 0 : from.first_name,
                            lastName: from === null || from === void 0 ? void 0 : from.last_name,
                        };
                        return [4 /*yield*/, this.getUser(userArg)];
                    case 1:
                        user = _e.sent();
                        activity = (_d = Number(text === null || text === void 0 ? void 0 : text.match(/\d+/))) !== null && _d !== void 0 ? _d : 100;
                        return [4 /*yield*/, punishment_1.default.findOne({
                                userIdCollection: user._id,
                            })];
                    case 2:
                        oldPunishment = _e.sent();
                        if (!oldPunishment) return [3 /*break*/, 4];
                        return [4 /*yield*/, punishment_1.default.findOneAndUpdate({ _id: oldPunishment._id }, { activity: activity })];
                    case 3:
                        _e.sent();
                        return [3 /*break*/, 6];
                    case 4: return [4 /*yield*/, punishment_1.default.create({
                            userIdCollection: user._id,
                            activity: activity,
                        })];
                    case 5:
                        _e.sent();
                        _e.label = 6;
                    case 6: return [4 /*yield*/, this.bot.api.sendMessage(user.chatIdCollection.chatId, (0, dietBot_1.MESSAGE_AFTER_CHANGING_PUNISHMENT)(user.name, activity))];
                    case 7:
                        _e.sent();
                        return [2 /*return*/];
                }
            });
        }); };
        this.checkMyChatMember = function (msg) { return __awaiter(_this, void 0, void 0, function () {
            var infoMe, id, chat, chatId;
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        infoMe = (_a = msg.update.my_chat_member) === null || _a === void 0 ? void 0 : _a.new_chat_member;
                        id = (_c = (_b = msg.update.my_chat_member) === null || _b === void 0 ? void 0 : _b.chat.id) !== null && _c !== void 0 ? _c : '';
                        return [4 /*yield*/, chat_1.default.findOne({ chatId: id })];
                    case 1:
                        chat = _d.sent();
                        if (!!chat) return [3 /*break*/, 5];
                        return [4 /*yield*/, chat_1.default.create({
                                chatId: id,
                            })];
                    case 2:
                        chatId = (_d.sent()).chatId;
                        return [4 /*yield*/, this.bot.api.sendMessage(chatId, dietBot_1.RULES)];
                    case 3:
                        _d.sent();
                        return [4 /*yield*/, this.bot.api.sendMessage(chatId, dietBot_1.GREETING_MESSAGE)];
                    case 4:
                        _d.sent();
                        return [2 /*return*/];
                    case 5:
                        if (!((infoMe === null || infoMe === void 0 ? void 0 : infoMe.status) === dietBot_1.NEEDED_STATUS && (infoMe === null || infoMe === void 0 ? void 0 : infoMe.can_pin_messages))) return [3 /*break*/, 8];
                        return [4 /*yield*/, chat_1.default.findOneAndUpdate({ chatId: chat.chatId }, { workStatus: true })];
                    case 6:
                        _d.sent();
                        return [4 /*yield*/, this.bot.api.sendMessage(chat.chatId, dietBot_1.MESSAGE_AFTER_GETTING_NEEDED_STATUS)];
                    case 7:
                        _d.sent();
                        return [3 /*break*/, 11];
                    case 8: return [4 /*yield*/, chat_1.default.findOneAndUpdate({ chatId: chat.chatId }, { workStatus: false })];
                    case 9:
                        _d.sent();
                        return [4 /*yield*/, this.bot.api.sendMessage(chat.chatId, dietBot_1.MESSAGE_AFTER_GETTING_BAD_STATUS)];
                    case 10:
                        _d.sent();
                        _d.label = 11;
                    case 11: return [2 /*return*/];
                }
            });
        }); };
        this.messageOnWrapperError = function (msg, error) { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c, _d, _e, _f;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        if (!msg) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.bot.api.sendMessage((_b = (_a = msg === null || msg === void 0 ? void 0 : msg.chat) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : '', (0, dietBot_1.MESSAGE_ON_WRAPPER_ERROR)(error.message, (_d = (_c = error === null || error === void 0 ? void 0 : error.stack) === null || _c === void 0 ? void 0 : _c.toString()) !== null && _d !== void 0 ? _d : ''))];
                    case 1:
                        _g.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        console.log('/ERR-01/Err with a router that hasn`t an access to the message object\n', (0, dietBot_1.MESSAGE_ON_WRAPPER_ERROR)(error.message, (_f = (_e = error === null || error === void 0 ? void 0 : error.stack) === null || _e === void 0 ? void 0 : _e.toString()) !== null && _f !== void 0 ? _f : ''));
                        _g.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        this.checkWorkBotStatus = function (msg) { return __awaiter(_this, void 0, void 0, function () {
            var id, chat;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (typeof msg === 'number') {
                            id = msg;
                        }
                        else {
                            id = (_b = (_a = msg === null || msg === void 0 ? void 0 : msg.chat) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : '';
                        }
                        return [4 /*yield*/, chat_1.default.findOne({ chatId: id })];
                    case 1:
                        chat = _c.sent();
                        if (chat === null || chat === void 0 ? void 0 : chat.workStatus)
                            return [2 /*return*/, true];
                        return [4 /*yield*/, this.bot.api.sendMessage(id, dietBot_1.NOT_ENOUGH_RIGHTS)];
                    case 2:
                        _c.sent();
                        return [2 /*return*/, false];
                }
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
