"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = require("./config");
var node_telegram_bot_api_1 = __importDefault(require("node-telegram-bot-api"));
var controllers_1 = __importDefault(require("./controllers"));
var services_1 = __importDefault(require("./services"));
var DietBotRoutes = /** @class */ (function () {
    function DietBotRoutes() {
        this.bot = new node_telegram_bot_api_1.default(config_1.token, { polling: true });
        this.service = new services_1.default(this.bot);
        this.controller = new controllers_1.default(this.service);
    }
    DietBotRoutes.prototype.getFoodReport = function () {
        this.bot.onText(/^\/прийом їжі$/i, this.controller.getFoodReport);
    };
    DietBotRoutes.prototype.answerOnFoodReport = function () {
        this.bot.on('poll_answer', this.controller.answerOnFoodReport);
    };
    DietBotRoutes.prototype.setTimesOfPhysicalPunishment = function () {
        this.bot.onText(/^\/фізична активність ([1-9]|[1-9][0-9]|[1-9][0-9][0-9])$/i, this.controller.setTimesOfPhysicalPunishment);
    };
    DietBotRoutes.prototype.checkChangingMyRights = function () {
        this.bot.on('my_chat_member', this.controller.checkChangingMyRights);
    };
    DietBotRoutes.prototype.addedToChat = function () {
        this.bot.on('new_chat_members', this.controller.addedToChat);
    };
    DietBotRoutes.prototype.joinedToChat = function () {
        this.bot.on('group_chat_created', this.controller.joinedToChat);
    };
    return DietBotRoutes;
}());
exports.default = DietBotRoutes;
