import DietBotService from '../services/dietBot';
import { UNKNWON_ERROR } from '../constants/dietBot';
import { Context } from 'grammy';

interface IDietBotController {
    readonly service: DietBotService;
    wrapper(msg: Context, service: Function, errMsg?: Context): void;

    getFoodReport(msg: Context): void;
    answerOnFoodReport(msg: Context): void;
    setTimesOfPhysicalPunishment(msg: Context): void;
    checkMyChatMember(msg: Context): void;
    getMessageStart(msg: Context): void;
}

export default class DietBotController implements IDietBotController {
    readonly service;

    constructor(service: DietBotService) {
        this.service = service;
    }

    getFoodReport = async (msg: Context) => {
        if (
            (await this.service.checkGroup(msg)) &&
            (await this.service.checkWorkBotStatus(msg))
        )
            await this.wrapper(msg, this.service.getFoodReport, msg);
    };

    answerOnFoodReport = async (msg: Context) => {
        await this.wrapper(msg, this.service.answerOnFoodReport);
    };

    setTimesOfPhysicalPunishment = async (msg: Context) => {
        if (
            (await this.service.checkGroup(msg)) &&
            (await this.service.checkWorkBotStatus(msg))
        )
            await this.wrapper(
                msg,
                this.service.setTimeOfPhysicalPunishment,
                msg
            );
    };

    checkMyChatMember = async (msg: Context) => {
        if (await this.service.checkGroup(msg))
            await this.wrapper(msg, this.service.checkMyChatMember, msg);
    };

    getMessageStart = async (msg: Context) => {
        await this.wrapper(msg, this.service.getMessageStart, msg);
    };

    wrapper = async (msg: Context, service: Function, errMsg?: Context) => {
        try {
            await service(msg);
        } catch (error: any) {
            if (msg) {
                console.log(error);
                console.log(msg);
                let errorToSend;

                if (error) {
                    if (error?.message === '') error.message = UNKNWON_ERROR;
                    errorToSend = error;
                } else {
                    errorToSend = new Error(UNKNWON_ERROR);
                }

                await this.service.messageOnWrapperError(errMsg, errorToSend);
            }
        }
    };
}
