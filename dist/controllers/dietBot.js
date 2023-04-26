import { UNKNWON_ERROR } from '../constants/dietBot';
export default class DietBotController {
    service;
    constructor(service) {
        this.service = service;
    }
    getFoodReport = async (msg) => {
        if (await this.service.checkWorkBotStatus(msg))
            await this.wrapper(msg, this.service.getFoodReport, msg);
    };
    answerOnFoodReport = async (msg) => {
        await this.wrapper(msg, this.service.answerOnFoodReport);
    };
    setTimesOfPhysicalPunishment = async (msg) => {
        if (await this.service.checkWorkBotStatus(msg))
            await this.wrapper(msg, this.service.setTimeOfPhysicalPunishment, msg);
    };
    checkMyChatMember = async (msg) => {
        await this.wrapper(msg, this.service.checkMyChatMember);
    };
    wrapper = async (msg, service, errMsg) => {
        try {
            await service(msg);
        }
        catch (error) {
            if (msg) {
                let errorToSend;
                if (error) {
                    if (error?.message === '')
                        error.message = UNKNWON_ERROR;
                    errorToSend = error;
                }
                else {
                    errorToSend = new Error(UNKNWON_ERROR);
                }
                await this.service.messageOnWrapperError(errMsg, errorToSend);
            }
        }
    };
}
