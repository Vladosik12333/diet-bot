import DietBotController from '../controllers/dietBot';
import DietBotService from '../services/dietBot';
export default class DietBotRoutes {
    bot;
    service;
    controller;
    constructor(bot) {
        this.bot = bot;
        this.service = new DietBotService(this.bot);
        this.controller = new DietBotController(this.service);
    }
    getFoodReport = () => {
        this.bot
            .filter(this.filterByRegExp(/^\/report$/))
            .command('report', this.controller.getFoodReport);
    };
    answerOnFoodReport = () => {
        this.bot.on('poll_answer', this.controller.answerOnFoodReport);
    };
    setTimesOfPhysicalPunishment = () => {
        this.bot
            .filter(this.filterByRegExp(/^\/punishment ([1-9]|[1-9][0-9]|[1-9][0-9][0-9])$/))
            .command('punishment', this.controller.setTimesOfPhysicalPunishment);
    };
    checkChangingMyRights = () => {
        this.bot.on('my_chat_member', this.controller.checkMyChatMember);
    };
    filterByRegExp = (regExp) => (msg) => regExp.test(msg.update.message?.text ?? '');
}
