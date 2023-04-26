"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var dietBot_1 = __importDefault(require("./routes/dietBot"));
var grammy_1 = require("grammy");
var config_1 = require("./config");
var express_1 = __importDefault(require("express"));
function startBot() {
    var bot = new grammy_1.Bot(config_1.token);
    var app = (0, express_1.default)();
    app.use(express_1.default.json());
    app.use("/".concat(config_1.token), (0, grammy_1.webhookCallback)(bot, 'express'));
    var dietBotRoutes = new dietBot_1.default(bot);
    dietBotRoutes.getFoodReport();
    dietBotRoutes.answerOnFoodReport();
    dietBotRoutes.setTimesOfPhysicalPunishment();
    dietBotRoutes.checkChangingMyRights();
    bot.start();
    // app.listen(port, async () => {
    //     bot.api.setWebhook(`http://localhost/${token}`);
    //     console.log('Bot started');
    // });
}
exports.default = startBot;
