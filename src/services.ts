import TelegramBot, {
    Message,
    PollAnswer,
    ChatMemberUpdated,
} from 'node-telegram-bot-api';

import {
    POLL,
    REPORT,
    MESSAGE_AFTER_GETTING_NEEDED_STATUS,
    NEEDED_STATUS,
    MESSAGE_AFTER_CHANGING_PUNISHMENT,
    RULES,
    GREETING_MESSAGE,
    CANNOT_FIND_ACTION,
    MESSAGE_ON_WRAPPER_ERROR,
    NOT_ENOUGH_RIGHTS,
} from './constants';

interface IDietBotService {
    readonly bot: TelegramBot;
    workBot: boolean;
    actions: Iactions[];

    checkWorkBotStatus(msg: Message | null): void;
    messageOnWrapperError(msg: Message | undefined, error: Error): void;
    getFoodReport(msg: Message): void;
    answerOnFoodReport(pollMsg: PollAnswer): void;
    setTimeOfPhysicalPunishment(msg: Message): void;
    checkChangingMyRights(msgRights: ChatMemberUpdated): void;
    onFirstBotMessage(msg: Message): void;
}

interface Iactions {
    chatId: number;
    type: actionType;
    state?: any;
}

enum actionType {
    poll = 'poll',
    activity = 'activity',
}

export default class DietBotService implements IDietBotService {
    readonly bot;
    workBot = false;
    actions: Iactions[] = [];

    constructor(bot: TelegramBot) {
        this.bot = bot;

        this.getFoodReport = this.getFoodReport.bind(this);
        this.answerOnFoodReport = this.answerOnFoodReport.bind(this);
        this.setTimeOfPhysicalPunishment =
            this.setTimeOfPhysicalPunishment.bind(this);
        this.checkChangingMyRights = this.checkChangingMyRights.bind(this);
        this.onFirstBotMessage = this.onFirstBotMessage.bind(this);
        this.messageOnWrapperError = this.messageOnWrapperError.bind(this);
        this.checkWorkBotStatus = this.checkWorkBotStatus.bind(this);
    }

    async getFoodReport(msg: Message) {
        const {
            chat: { id },
            from,
        } = msg;

        await this.bot.sendMessage(id, REPORT.PENDING(from?.username ?? ''));

        const messageOfPoll = await this.bot.sendPoll(
            id,
            POLL.QUESTION,
            [POLL.OPTION_1, POLL.OPTION_2],
            {
                is_anonymous: false,
            }
        );

        this.actions.push({
            chatId: id,
            type: actionType.poll,
            state: {
                msgPollId: messageOfPoll.message_id,
                pollId: messageOfPoll.poll?.id ?? '',
                userId: msg.from?.id ?? -1,
                nick: msg.from?.username ?? '',
                name: `${msg.from?.first_name ?? ''} ${
                    msg.from?.last_name ?? ''
                }`,
            },
        });
    }

    async answerOnFoodReport(pollMsg: PollAnswer) {
        const actionIndex = this.actions.findIndex(
            ({ type, state }) =>
                type === actionType.poll && state.pollId === pollMsg.poll_id
        );

        if (actionIndex === -1) throw new Error(CANNOT_FIND_ACTION);

        const action = this.actions[actionIndex];
        const {
            chatId,
            state: { msgPollId, name, nick },
        } = action;

        if (pollMsg.option_ids[0] === 0) {
            await this.bot.stopPoll(chatId, msgPollId);

            await this.bot.sendMessage(chatId, REPORT.APPROVED(nick));
        } else {
            await this.bot.stopPoll(chatId, msgPollId);

            await this.bot.sendMessage(chatId, REPORT.REJECTED(nick));

            const activityAction = this.actions.find(
                ({ type, state: { userId } }) =>
                    type === actionType.activity &&
                    userId === action.state.userId
            );

            const nameToResponse = name ? name : nick;
            const activity = activityAction?.state?.activity ?? 100;

            const messageOfPunishment = await this.bot.sendMessage(
                chatId,
                REPORT.MESSAGE_AFTER_APPROVED(nameToResponse, activity)
            );

            await this.bot.pinChatMessage(
                chatId,
                messageOfPunishment.message_id
            );
        }

        this.actions.splice(actionIndex, 1);
    }

    async setTimeOfPhysicalPunishment(msg: Message) {
        const activity = msg.text?.match(/\d+/);

        await this.bot.sendMessage(
            msg.chat.id,
            MESSAGE_AFTER_CHANGING_PUNISHMENT(
                msg.from?.username ?? '',
                Number(activity) ?? 100
            )
        );

        const newAction = {
            chatId: msg.chat.id,
            type: actionType.activity,
            state: {
                activity: Number(activity),
                userId: msg.from?.id ?? -1,
                nick: msg.from?.username ?? '',
                name: `${msg.from?.first_name ?? ''} ${
                    msg.from?.last_name ?? ''
                }`,
            },
        };

        const olderPunishmentIndex = this.actions.findIndex(
            (action) =>
                action.type === actionType.activity &&
                action.state.userId === msg?.from?.id
        );

        if (olderPunishmentIndex === -1) {
            this.actions.push(newAction);
        } else {
            this.actions.splice(olderPunishmentIndex, 1, newAction);
        }
    }

    async checkChangingMyRights(rightsMsg: ChatMemberUpdated) {
        const {
            new_chat_member: newRights,
            chat: { id },
        } = rightsMsg;

        if (newRights.status === NEEDED_STATUS && newRights.can_pin_messages) {
            this.workBot = true;

            await this.bot.sendMessage(id, MESSAGE_AFTER_GETTING_NEEDED_STATUS);
        }
    }

    async onFirstBotMessage(msg: Message) {
        const { id } = msg.chat;

        await this.bot.sendMessage(id, RULES);
        await this.bot.sendMessage(id, GREETING_MESSAGE);
    }

    async messageOnWrapperError(msg: Message | undefined, error: Error) {
        if (msg)
            await this.bot.sendMessage(
                msg.chat.id,
                MESSAGE_ON_WRAPPER_ERROR(
                    error?.message ?? '',
                    error?.stack?.toString() ?? ''
                )
            );
    }

    async checkWorkBotStatus(msg: Message | null) {
        const status = this.workBot;

        // if (!status) {
        //     if (msg?.chat.id)
        //         await this.bot.sendMessage(msg.chat.id, NOT_ENOUGH_RIGHTS);
        //     return false;
        // }

        return true;
    }
}
