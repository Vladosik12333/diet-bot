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
Object.defineProperty(exports, "__esModule", { value: true });
var constants_1 = require("./constants");
var actionType;
(function (actionType) {
    actionType["poll"] = "poll";
    actionType["activity"] = "activity";
})(actionType || (actionType = {}));
var DietBotService = /** @class */ (function () {
    function DietBotService(bot) {
        this.workBot = false;
        this.actions = [];
        this.bot = bot;
        this.getFoodReport = this.getFoodReport.bind(this);
        this.answerOnFoodReport = this.answerOnFoodReport.bind(this);
        this.setTimeOfPhysicalPunishment =
            this.setTimeOfPhysicalPunishment.bind(this);
        this.checkChangingMyRights = this.checkChangingMyRights.bind(this);
        this.onFirstBotMessage = this.onFirstBotMessage.bind(this);
        this.messageOnWrapperError = this.messageOnWrapperError.bind(this);
        this.checkWorkBotStatus = this.checkWorkBotStatus.bind(this);
    }
    DietBotService.prototype.getFoodReport = function (msg) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
        return __awaiter(this, void 0, void 0, function () {
            var id, from, messageOfPoll;
            return __generator(this, function (_m) {
                switch (_m.label) {
                    case 0:
                        id = msg.chat.id, from = msg.from;
                        return [4 /*yield*/, this.bot.sendMessage(id, constants_1.REPORT.PENDING((_a = from === null || from === void 0 ? void 0 : from.username) !== null && _a !== void 0 ? _a : ''))];
                    case 1:
                        _m.sent();
                        return [4 /*yield*/, this.bot.sendPoll(id, constants_1.POLL.QUESTION, [constants_1.POLL.OPTION_1, constants_1.POLL.OPTION_2], {
                                is_anonymous: false,
                            })];
                    case 2:
                        messageOfPoll = _m.sent();
                        this.actions.push({
                            chatId: id,
                            type: actionType.poll,
                            state: {
                                msgPollId: messageOfPoll.message_id,
                                pollId: (_c = (_b = messageOfPoll.poll) === null || _b === void 0 ? void 0 : _b.id) !== null && _c !== void 0 ? _c : '',
                                userId: (_e = (_d = msg.from) === null || _d === void 0 ? void 0 : _d.id) !== null && _e !== void 0 ? _e : -1,
                                nick: (_g = (_f = msg.from) === null || _f === void 0 ? void 0 : _f.username) !== null && _g !== void 0 ? _g : '',
                                name: "".concat((_j = (_h = msg.from) === null || _h === void 0 ? void 0 : _h.first_name) !== null && _j !== void 0 ? _j : '', " ").concat((_l = (_k = msg.from) === null || _k === void 0 ? void 0 : _k.last_name) !== null && _l !== void 0 ? _l : ''),
                            },
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    DietBotService.prototype.answerOnFoodReport = function (pollMsg) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var actionIndex, action, chatId, _c, msgPollId, name, nick, activityAction, nameToResponse, activity, messageOfPunishment;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        actionIndex = this.actions.findIndex(function (_a) {
                            var type = _a.type, state = _a.state;
                            return type === actionType.poll && state.pollId === pollMsg.poll_id;
                        });
                        if (actionIndex === -1)
                            throw new Error(constants_1.CANNOT_FIND_ACTION);
                        action = this.actions[actionIndex];
                        chatId = action.chatId, _c = action.state, msgPollId = _c.msgPollId, name = _c.name, nick = _c.nick;
                        if (!(pollMsg.option_ids[0] === 0)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.bot.stopPoll(chatId, msgPollId)];
                    case 1:
                        _d.sent();
                        return [4 /*yield*/, this.bot.sendMessage(chatId, constants_1.REPORT.APPROVED(nick))];
                    case 2:
                        _d.sent();
                        return [3 /*break*/, 8];
                    case 3: return [4 /*yield*/, this.bot.stopPoll(chatId, msgPollId)];
                    case 4:
                        _d.sent();
                        return [4 /*yield*/, this.bot.sendMessage(chatId, constants_1.REPORT.REJECTED(nick))];
                    case 5:
                        _d.sent();
                        activityAction = this.actions.find(function (_a) {
                            var type = _a.type, userId = _a.state.userId;
                            return type === actionType.activity &&
                                userId === action.state.userId;
                        });
                        nameToResponse = name ? name : nick;
                        activity = (_b = (_a = activityAction === null || activityAction === void 0 ? void 0 : activityAction.state) === null || _a === void 0 ? void 0 : _a.activity) !== null && _b !== void 0 ? _b : 100;
                        return [4 /*yield*/, this.bot.sendMessage(chatId, constants_1.REPORT.MESSAGE_AFTER_APPROVED(nameToResponse, activity))];
                    case 6:
                        messageOfPunishment = _d.sent();
                        return [4 /*yield*/, this.bot.pinChatMessage(chatId, messageOfPunishment.message_id)];
                    case 7:
                        _d.sent();
                        _d.label = 8;
                    case 8:
                        this.actions.splice(actionIndex, 1);
                        return [2 /*return*/];
                }
            });
        });
    };
    DietBotService.prototype.setTimeOfPhysicalPunishment = function (msg) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
        return __awaiter(this, void 0, void 0, function () {
            var activity, newAction, olderPunishmentIndex;
            return __generator(this, function (_o) {
                switch (_o.label) {
                    case 0:
                        activity = (_a = msg.text) === null || _a === void 0 ? void 0 : _a.match(/\d+/);
                        return [4 /*yield*/, this.bot.sendMessage(msg.chat.id, (0, constants_1.MESSAGE_AFTER_CHANGING_PUNISHMENT)((_c = (_b = msg.from) === null || _b === void 0 ? void 0 : _b.username) !== null && _c !== void 0 ? _c : '', (_d = Number(activity)) !== null && _d !== void 0 ? _d : 100))];
                    case 1:
                        _o.sent();
                        newAction = {
                            chatId: msg.chat.id,
                            type: actionType.activity,
                            state: {
                                activity: Number(activity),
                                userId: (_f = (_e = msg.from) === null || _e === void 0 ? void 0 : _e.id) !== null && _f !== void 0 ? _f : -1,
                                nick: (_h = (_g = msg.from) === null || _g === void 0 ? void 0 : _g.username) !== null && _h !== void 0 ? _h : '',
                                name: "".concat((_k = (_j = msg.from) === null || _j === void 0 ? void 0 : _j.first_name) !== null && _k !== void 0 ? _k : '', " ").concat((_m = (_l = msg.from) === null || _l === void 0 ? void 0 : _l.last_name) !== null && _m !== void 0 ? _m : ''),
                            },
                        };
                        olderPunishmentIndex = this.actions.findIndex(function (action) {
                            var _a;
                            return action.type === actionType.activity &&
                                action.state.userId === ((_a = msg === null || msg === void 0 ? void 0 : msg.from) === null || _a === void 0 ? void 0 : _a.id);
                        });
                        if (olderPunishmentIndex === -1) {
                            this.actions.push(newAction);
                        }
                        else {
                            this.actions.splice(olderPunishmentIndex, 1, newAction);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    DietBotService.prototype.checkChangingMyRights = function (rightsMsg) {
        return __awaiter(this, void 0, void 0, function () {
            var newRights, id;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        newRights = rightsMsg.new_chat_member, id = rightsMsg.chat.id;
                        if (!(newRights.status === constants_1.NEEDED_STATUS && newRights.can_pin_messages)) return [3 /*break*/, 2];
                        this.workBot = true;
                        return [4 /*yield*/, this.bot.sendMessage(id, constants_1.MESSAGE_AFTER_GETTING_NEEDED_STATUS)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    DietBotService.prototype.onFirstBotMessage = function (msg) {
        return __awaiter(this, void 0, void 0, function () {
            var id;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = msg.chat.id;
                        return [4 /*yield*/, this.bot.sendMessage(id, constants_1.RULES)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.bot.sendMessage(id, constants_1.GREETING_MESSAGE)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DietBotService.prototype.messageOnWrapperError = function (msg, error) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        if (!msg) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.bot.sendMessage(msg.chat.id, (0, constants_1.MESSAGE_ON_WRAPPER_ERROR)((_a = error === null || error === void 0 ? void 0 : error.message) !== null && _a !== void 0 ? _a : '', (_c = (_b = error === null || error === void 0 ? void 0 : error.stack) === null || _b === void 0 ? void 0 : _b.toString()) !== null && _c !== void 0 ? _c : ''))];
                    case 1:
                        _d.sent();
                        _d.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    DietBotService.prototype.checkWorkBotStatus = function (msg) {
        return __awaiter(this, void 0, void 0, function () {
            var status;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        status = this.workBot;
                        if (!!status) return [3 /*break*/, 3];
                        if (!(msg === null || msg === void 0 ? void 0 : msg.chat.id)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.bot.sendMessage(msg.chat.id, constants_1.NOT_ENOUGH_RIGHTS)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/, false];
                    case 3: return [2 /*return*/, true];
                }
            });
        });
    };
    return DietBotService;
}());
exports.default = DietBotService;
