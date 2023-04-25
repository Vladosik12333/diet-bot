import { token } from '../config';
import TelegramBot from 'node-telegram-bot-api';
import DietBotController from '../controllers/dietBot';
import DietBotService from '../services/dietBot';

interface IDietBotRoutes {
    readonly bot: TelegramBot;
    readonly service: DietBotService;
    readonly controller: DietBotController;

    getFoodReport(): void;
    answerOnFoodReport(): void;
    setTimesOfPhysicalPunishment(): void;
    checkChangingMyRights(): void;
    addedToChat(): void;
    joinedToChat(): void;
}

export default class DietBotRoutes implements IDietBotRoutes {
    readonly bot = new TelegramBot(token, { polling: true });
    readonly service;
    readonly controller;

    constructor() {
        this.service = new DietBotService(this.bot);
        this.controller = new DietBotController(this.service);
    }

    getFoodReport() {
        this.bot.onText(/^\/прийом їжі$/i, this.controller.getFoodReport);
    }

    answerOnFoodReport() {
        this.bot.on('poll_answer', this.controller.answerOnFoodReport);
    }

    setTimesOfPhysicalPunishment() {
        this.bot.onText(
            /^\/фізична активність ([1-9]|[1-9][0-9]|[1-9][0-9][0-9])$/i,
            this.controller.setTimesOfPhysicalPunishment
        );
    }

    checkChangingMyRights() {
        this.bot.on('my_chat_member', this.controller.checkChangingMyRights);
    }

    addedToChat() {
        this.bot.on('new_chat_members', this.controller.addedToChat);
    }

    joinedToChat() {
        this.bot.on('group_chat_created', this.controller.joinedToChat);
    }
}
