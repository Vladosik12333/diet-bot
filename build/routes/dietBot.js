"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var dietBot_1 = __importDefault(require("../controllers/dietBot"));
var dietBot_2 = __importDefault(require("../services/dietBot"));
var DietBotRoutes = /** @class */ (function () {
    function DietBotRoutes(bot) {
        var _this = this;
        this.getFoodReport = function () {
            _this.bot
                .filter(_this.filterByRegExp(/^\/report$/))
                .command('report', _this.controller.getFoodReport);
        };
        this.answerOnFoodReport = function () {
            _this.bot.on('poll_answer', _this.controller.answerOnFoodReport);
        };
        this.setTimesOfPhysicalPunishment = function () {
            _this.bot
                .filter(_this.filterByRegExp(/^\/punishment ([1-9]|[1-9][0-9]|[1-9][0-9][0-9])$/))
                .command('punishment', _this.controller.setTimesOfPhysicalPunishment);
        };
        this.checkChangingMyRights = function () {
            _this.bot.on('my_chat_member', _this.controller.checkMyChatMember);
        };
        this.filterByRegExp = function (regExp) { return function (msg) { var _a, _b; return regExp.test((_b = (_a = msg.update.message) === null || _a === void 0 ? void 0 : _a.text) !== null && _b !== void 0 ? _b : ''); }; };
        this.bot = bot;
        this.service = new dietBot_2.default(this.bot);
        this.controller = new dietBot_1.default(this.service);
    }
    return DietBotRoutes;
}());
exports.default = DietBotRoutes;
