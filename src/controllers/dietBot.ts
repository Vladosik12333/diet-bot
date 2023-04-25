import { ChatMemberUpdated, Message, PollAnswer } from 'node-telegram-bot-api';
import DietBotService from '../services/dietBot';
import { UNKNWON_ERROR } from '../constants/dietBot';

interface IDietBotController {
    readonly service: DietBotService;
    wrapper<M>(msg: M, service: Function, errMsg?: Message): void;

    getFoodReport(msg: Message): void;
    answerOnFoodReport(pollMsg: PollAnswer): void;
    setTimesOfPhysicalPunishment(msg: Message): void;
    checkChangingMyRights(rightsMsg: ChatMemberUpdated): void;
    addedToChat(msg: Message): void;
    joinedToChat(msg: Message): void;
}

export default class DietBotController implements IDietBotController {
    readonly service;

    constructor(service: DietBotService) {
        this.service = service;

        this.getFoodReport = this.getFoodReport.bind(this);
        this.answerOnFoodReport = this.answerOnFoodReport.bind(this);
        this.setTimesOfPhysicalPunishment =
            this.setTimesOfPhysicalPunishment.bind(this);
        this.checkChangingMyRights = this.checkChangingMyRights.bind(this);
        this.addedToChat = this.addedToChat.bind(this);
        this.joinedToChat = this.joinedToChat.bind(this);
        this.wrapper = this.wrapper.bind(this);
    }

    async getFoodReport(msg: Message) {
        if (await this.service.checkWorkBotStatus(msg))
            await this.wrapper(msg, this.service.getFoodReport, msg);
    }

    async answerOnFoodReport(pollMsg: PollAnswer) {
        if (await this.service.checkWorkBotStatus(null))
            await this.wrapper(pollMsg, this.service.answerOnFoodReport);
    }

    async setTimesOfPhysicalPunishment(msg: Message) {
        if (await this.service.checkWorkBotStatus(msg))
            await this.wrapper(
                msg,
                this.service.setTimeOfPhysicalPunishment,
                msg
            );
    }

    async checkChangingMyRights(rightsMsg: ChatMemberUpdated) {
        await this.wrapper(rightsMsg, this.service.checkChangingMyRights);
    }

    async addedToChat(msg: Message) {
        await this.wrapper(msg, this.service.onFirstBotMessage, msg);
    }

    async joinedToChat(msg: Message) {
        await this.wrapper(msg, this.service.onFirstBotMessage, msg);
    }

    async wrapper<M>(msg: M, service: Function, errMsg?: Message) {
        try {
            await service(msg);
        } catch (error: any) {
            if (msg) {
                let errorToSend;

                if (error) {
                    if (error.message === '') error.message = UNKNWON_ERROR;
                    errorToSend = error;
                } else {
                    errorToSend = new Error(UNKNWON_ERROR);
                }

                await this.service.messageOnWrapperError(errMsg, errorToSend);
            }
        }
    }
}
