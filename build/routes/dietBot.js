"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var dietBot_1 = __importDefault(require("../controllers/dietBot"));
var dietBot_2 = __importDefault(require("../services/dietBot"));
var DietBotRoutes = /** @class */ (function () {
    function DietBotRoutes(bot) {
        this.bot = bot;
        this.service = new dietBot_2.default(this.bot);
        this.controller = new dietBot_1.default(this.service);
    }
    DietBotRoutes.prototype.getFoodReport = function () {
        this.bot.command('report', this.controller.getFoodReport);
    };
    DietBotRoutes.prototype.answerOnFoodReport = function () {
        this.bot.on('poll_answer', this.controller.answerOnFoodReport);
    };
    DietBotRoutes.prototype.setTimesOfPhysicalPunishment = function () {
        // this.bot.onText(
        //     /^\/фізична активність ([1-9]|[1-9][0-9]|[1-9][0-9][0-9])$/i,
        //     this.controller.setTimesOfPhysicalPunishment
        // );
    };
    DietBotRoutes.prototype.checkChangingMyRights = function () {
        this.bot.on('my_chat_member', this.controller.checkChangingMyRights);
    };
    return DietBotRoutes;
}());
exports.default = DietBotRoutes;
