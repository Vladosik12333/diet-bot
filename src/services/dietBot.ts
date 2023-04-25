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
    MESSAGE_AFTER_GETTING_BAD_STATUS,
} from '../constants/dietBot';

import User, { IUser } from '../models/user';
import Poll, { IPoll } from '../models/poll';
import Punishment, { IPunishment } from '../models/punishment';
import Chat, { IChat } from '../models/chat';

interface IDietBotService {
    readonly bot: TelegramBot;

    checkWorkBotStatus(msg: Message): void;
    messageOnWrapperError(msg: Message | undefined, error: Error): void;
    getFoodReport(msg: Message): void;
    answerOnFoodReport(pollMsg: PollAnswer): void;
    setTimeOfPhysicalPunishment(msg: Message): void;
    checkChangingMyRights(msgRights: ChatMemberUpdated): void;
    onFirstBotMessage(msg: Message): void;
    getUser(msgUser: ImsgUser): Promise<IUser<IChat> | null>;
}

interface ImsgUser {
    chatId: number;
    userId: number | undefined;
    nick: string | undefined;
    firstName: string | undefined;
    lastName: string | undefined;
}

export default class DietBotService implements IDietBotService {
    readonly bot;

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

        await this.bot.sendMessage(
            user?.chatIdCollection.chatId,
            REPORT.PENDING(user?.name)
        );

        const messageOfPoll = await this.bot.sendPoll(
            user.chatIdCollection.chatId,
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

        const [poll]: any = await Poll.aggregate([
            {
                $match: {
                    pollId: poll_id,
                },
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'userIdCollection',
                    foreignField: '_id',
                    as: 'user',
                    pipeline: [
                        {
                            $lookup: {
                                from: 'chats',
                                localField: 'chatIdCollection',
                                foreignField: '_id',
                                as: 'chat',
                            },
                        },
                    ],
                },
            },
        ]);

        if (!poll) throw new Error(CANNOT_FIND_POLL);

        const { messageIdOfPoll, _id: pollId, user } = poll;

        const { chat, nick, name, _id: userId } = user[0];

        const { chatId } = chat[0];

        const finishPoll = async (approved: boolean) => {
            await this.bot.stopPoll(chatId, messageIdOfPoll);

            await this.bot.sendMessage(
                chatId,
                approved ? REPORT.APPROVED(nick) : REPORT.REJECTED(nick)
            );
        };

        await Poll.deleteOne({ _id: pollId });

        if (pollMsg.option_ids[0] === 0) {
            await finishPoll(true);
        } else {
            await finishPoll(false);

            const punishment = await Punishment.findOne({
                userIdCollection: userId,
            });

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

        const oldPunishment = await Punishment.findOne({
            userIdCollection: user._id,
        });

        if (oldPunishment) {
            await Punishment.findOneAndUpdate(
                { _id: oldPunishment._id },
                { activity }
            );
        } else {
            await Punishment.create({
                userIdCollection: user._id,
                activity,
            });
        }

        await this.bot.sendMessage(
            user.chatIdCollection.chatId,
            MESSAGE_AFTER_CHANGING_PUNISHMENT(user.name, activity)
        );
    };

    checkChangingMyRights = async (rightsMsg: ChatMemberUpdated) => {
        const {
            new_chat_member: newRights,
            chat: { id },
        } = rightsMsg;

        const checkChat = async (workStatus: boolean) => {
            const chat = await Chat.findOneAndUpdate(
                { chatId: id },
                { workStatus }
            );

            return !!chat;
        };

        if (newRights.status === NEEDED_STATUS && newRights.can_pin_messages) {
            if (!(await checkChat(true))) return;

            await this.bot.sendMessage(id, MESSAGE_AFTER_GETTING_NEEDED_STATUS);
        } else {
            if (!(await checkChat(false))) return;

            await this.bot.sendMessage(id, MESSAGE_AFTER_GETTING_BAD_STATUS);
        }
    };

    onFirstBotMessage = async (msg: Message) => {
        const { id } = msg.chat;

        await Chat.create({
            chatId: id,
        });

        await this.bot.sendMessage(id, RULES);
        await this.bot.sendMessage(id, GREETING_MESSAGE);
    };

    messageOnWrapperError = async (msg: Message | undefined, error: Error) => {
        if (msg)
            await this.bot.sendMessage(
                msg.chat.id,
                MESSAGE_ON_WRAPPER_ERROR(
                    error.message,
                    error?.stack?.toString() ?? ''
                )
            );
    };

    checkWorkBotStatus = async (msg: Message) => {
        const id = msg?.chat.id;

        const chat = await Chat.findOne({ chatId: id });

        if (chat?.workStatus) return true;

        await this.bot.sendMessage(id, NOT_ENOUGH_RIGHTS);

        return false;
    };

    getUser = async (msgUser: ImsgUser): Promise<IUser<IChat>> => {
        const users: Array<IUser<IChat> | null> = await User.find({
            userId: msgUser.userId,
        }).populate('chatIdCollection');

        const chat = await Chat.findOne({ chatId: msgUser.chatId });
        const user = users.find(
            (user) =>
                user?.chatIdCollection._id.toString() === chat?._id.toString()
        );

        if (!user) {
            let chat;
            chat = await Chat.findOne({ chatId: msgUser.chatId });

            if (!chat) {
                chat = await Chat.create({
                    chatId: msgUser.chatId,
                    workStatus: true,
                });
            }

            const newUser = await User.create({
                chatIdCollection: chat._id,
                userId: msgUser.userId ?? -1,
                nick: msgUser.nick?.trimEnd() ?? '',
                name: `${msgUser.firstName ?? ''} ${
                    msgUser.lastName ?? ''
                }`.trimEnd(),
            });

            const user: any = newUser;

            user.chatIdCollection = chat;

            return user;
        }

        return user;
    };
}
