import { Bot, Context } from 'grammy';
import DietBotController from '../controllers/dietBot';
import DietBotService from '../services/dietBot';

interface IDietBotRoutes {
    readonly bot: Bot;
    readonly service: DietBotService;
    readonly controller: DietBotController;

    getFoodReport(): void;
    answerOnFoodReport(): void;
    setTimesOfPhysicalPunishment(): void;
    checkChangingMyRights(): void;
    getMessageStart(): void;
}

export default class DietBotRoutes implements IDietBotRoutes {
    readonly bot;
    readonly service;
    readonly controller;

    constructor(bot: Bot) {
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
            .filter(
                this.filterByRegExp(
                    /^\/punishment ([1-9]|[1-9][0-9]|[1-9][0-9][0-9])$/
                )
            )
            .command(
                'punishment',
                this.controller.setTimesOfPhysicalPunishment
            );
    };

    checkChangingMyRights = () => {
        this.bot.on('my_chat_member', this.controller.checkMyChatMember);
    };

    getMessageStart = () => {
        this.bot
            .filter(this.filterByRegExp(/^\/start$/))
            .command('start', this.controller.getMessageStart);
    };

    filterByRegExp = (regExp: RegExp) => (msg: Context) =>
        regExp.test(msg.update.message?.text ?? '');
}
