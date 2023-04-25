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
    CANNOT_FIND_POLL,
    MESSAGE_ON_WRAPPER_ERROR,
    NOT_ENOUGH_RIGHTS,
} from '../constants/dietBot';

import User, { IUser } from '../models/users';
import Poll, { IPoll } from '../models/poll';
import Punishment, { IPunishment } from '../models/punishment';

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
    getUser(msgUser: ImsgUser): Promise<IUser>;
}

interface ImsgUser {
    chatId: number;
    userId: number | undefined;
    nick: string | undefined;
    firstName: string | undefined;
    lastName: string | undefined;
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
    }

    getFoodReport = async (msg: Message) => {
        const { from, chat } = msg;

        const userArg: ImsgUser = {
            chatId: chat.id,
            userId: from?.id,
            nick: from?.username,
            firstName: from?.first_name,
            lastName: from?.last_name,
        };

        const user = await this.getUser(userArg);

        await this.bot.sendMessage(user.chatId, REPORT.PENDING(user.name));

        const messageOfPoll = await this.bot.sendPoll(
            user.chatId,
            POLL.QUESTION,
            [POLL.OPTION_1, POLL.OPTION_2],
            {
                is_anonymous: false,
            }
        );

        await Poll.create({
            userIdCollection: user._id,
            messageIdOfPoll: messageOfPoll.message_id,
            pollId: messageOfPoll.poll?.id ?? '',
        });
    };

    answerOnFoodReport = async (pollMsg: PollAnswer) => {
        const { poll_id } = pollMsg;

        const poll = await Poll.findOne<IPoll>({
            pollId: poll_id,
        }).populate<IUser>('userIdCollection');

        if (!poll) throw new Error(CANNOT_FIND_POLL);

        const { messageOfPullId, chatId, nick, name, userIdCollection } = poll;

        const finishPull = async (approved: boolean) => {
            await this.bot.stopPoll(chatId, messageOfPullId);

            await this.bot.sendMessage(
                chatId,
                approved ? REPORT.APPROVED(nick) : REPORT.REJECTED(nick)
            );
        };

        await Poll.deleteOne({ _id: poll_id });

        if (pollMsg.option_ids[0] === 0) {
            await finishPull(true);
        } else {
            await finishPull(false);

            const punishment = await Punishment.findOne({ userIdCollection });

            const nameToResponse = name ? name : nick;
            const activity = punishment?.activity ?? 100;

            const messageOfPunishment = await this.bot.sendMessage(
                chatId,
                REPORT.MESSAGE_AFTER_APPROVED(nameToResponse, activity)
            );

            await this.bot.pinChatMessage(
                chatId,
                messageOfPunishment.message_id
            );
        }
    };

    setTimeOfPhysicalPunishment = async (msg: Message) => {
        const { from, chat, text } = msg;

        const userArg: ImsgUser = {
            chatId: chat.id,
            userId: from?.id,
            nick: from?.username,
            firstName: from?.first_name,
            lastName: from?.last_name,
        };

        const user = await this.getUser(userArg);

        const activity = Number(text?.match(/\d+/)) ?? 100;

        const oldPunishment = await Punishment.findOne(user._id);

        if (oldPunishment) {
            await Punishment.findOneAndUpdate(oldPunishment._id, { activity });
        } else {
            await Punishment.create({
                userIdCollection: user.chatId,
                activity,
            });
        }

        await this.bot.sendMessage(
            user.chatId,
            MESSAGE_AFTER_CHANGING_PUNISHMENT(user.name, activity)
        );
    };

    checkChangingMyRights = async (rightsMsg: ChatMemberUpdated) => {
        const {
            new_chat_member: newRights,
            chat: { id },
        } = rightsMsg;

        if (newRights.status === NEEDED_STATUS && newRights.can_pin_messages) {
            this.workBot = true;

            await this.bot.sendMessage(id, MESSAGE_AFTER_GETTING_NEEDED_STATUS);
        }
    };

    onFirstBotMessage = async (msg: Message) => {
        const { id } = msg.chat;

        await this.bot.sendMessage(id, RULES);
        await this.bot.sendMessage(id, GREETING_MESSAGE);
    };

    messageOnWrapperError = async (msg: Message | undefined, error: Error) => {
        if (msg)
            await this.bot.sendMessage(
                msg.chat.id,
                MESSAGE_ON_WRAPPER_ERROR(
                    error?.message ?? '',
                    error?.stack?.toString() ?? ''
                )
            );
    };

    checkWorkBotStatus = async (msg: Message | null) => {
        const status = this.workBot;

        if (!status) {
            if (msg?.chat.id)
                await this.bot.sendMessage(msg.chat.id, NOT_ENOUGH_RIGHTS);
            return false;
        }

        return true;
    };

    getUser = async (msgUser: ImsgUser): Promise<IUser> => {
        const user = await User.findOne({ userId: msgUser.userId });

        if (!user) {
            const newUser = await User.create({
                chatId: msgUser.chatId,
                userId: msgUser.userId ?? -1,
                nick: msgUser.nick ?? '',
                name: `${msgUser.firstName ?? ''} ${msgUser.lastName ?? ''}`,
            });

            return newUser;
        }

        return user;
    };
}
