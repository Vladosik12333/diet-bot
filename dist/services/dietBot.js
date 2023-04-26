import { POLL, REPORT, MESSAGE_AFTER_GETTING_NEEDED_STATUS, NEEDED_STATUS, MESSAGE_AFTER_CHANGING_PUNISHMENT, RULES, GREETING_MESSAGE, CANNOT_FIND_POLL, MESSAGE_ON_WRAPPER_ERROR, NOT_ENOUGH_RIGHTS, MESSAGE_AFTER_GETTING_BAD_STATUS, } from '../constants/dietBot';
import User from '../models/user';
import Poll from '../models/poll';
import Punishment from '../models/punishment';
import Chat from '../models/chat';
export default class DietBotService {
    bot;
    constructor(bot) {
        this.bot = bot;
    }
    getFoodReport = async (msg) => {
        const from = msg.update.message?.from;
        const chat = msg.update.message?.chat;
        const userArg = {
            chatId: chat?.id,
            userId: from?.id,
            nick: from?.username,
            firstName: from?.first_name,
            lastName: from?.last_name,
        };
        const user = await this.getUser(userArg);
        await this.bot.api.sendMessage(user?.chatIdCollection.chatId, REPORT.PENDING(user?.name));
        const messageOfPoll = await this.bot.api.sendPoll(user.chatIdCollection.chatId, POLL.QUESTION, [POLL.OPTION_1, POLL.OPTION_2], {
            is_anonymous: false,
        });
        await Poll.create({
            userIdCollection: user._id,
            messageIdOfPoll: messageOfPoll.message_id,
            pollId: messageOfPoll.poll.id,
        });
    };
    answerOnFoodReport = async (msg) => {
        const pollByBot = msg.update.poll_answer;
        const [poll] = await Poll.aggregate([
            {
                $match: {
                    pollId: pollByBot?.poll_id,
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
        if (!poll)
            throw new Error(CANNOT_FIND_POLL);
        const { messageIdOfPoll, _id: pollId, user } = poll;
        const { chat, nick, name, _id: userId } = user[0];
        if (!(await this.checkWorkBotStatus(chat[0].chatId)))
            return;
        const { chatId } = chat[0];
        const finishPoll = async (approved) => {
            await Poll.deleteOne({ _id: pollId });
            await this.bot.api.deleteMessage(chatId, messageIdOfPoll);
            await this.bot.api.sendMessage(chatId, approved
                ? REPORT.APPROVED(nick, pollByBot?.user.username ?? '')
                : REPORT.REJECTED(nick, pollByBot?.user.username ?? ''));
        };
        if (pollByBot?.option_ids[0] === 0) {
            await finishPoll(true);
        }
        else {
            await finishPoll(false);
            const punishment = await Punishment.findOne({
                userIdCollection: userId,
            });
            const nameToResponse = name ? name : nick;
            const activity = punishment?.activity ?? 100;
            const messageOfPunishment = await this.bot.api.sendMessage(chatId, REPORT.MESSAGE_AFTER_APPROVED(nameToResponse, activity));
            await this.bot.api.pinChatMessage(chatId, messageOfPunishment.message_id);
        }
    };
    setTimeOfPhysicalPunishment = async (msg) => {
        const id = msg.update.message?.chat.id;
        const from = msg.update.message?.from;
        const text = msg.update.message?.text;
        const userArg = {
            chatId: id,
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
            await Punishment.findOneAndUpdate({ _id: oldPunishment._id }, { activity });
        }
        else {
            await Punishment.create({
                userIdCollection: user._id,
                activity,
            });
        }
        await this.bot.api.sendMessage(user.chatIdCollection.chatId, MESSAGE_AFTER_CHANGING_PUNISHMENT(user.name, activity));
    };
    checkMyChatMember = async (msg) => {
        const infoMe = msg.update.my_chat_member?.new_chat_member;
        const id = msg.update.my_chat_member?.chat.id ?? '';
        const chat = await Chat.findOne({ chatId: id });
        if (!chat) {
            const { chatId } = await Chat.create({
                chatId: id,
            });
            await this.bot.api.sendMessage(chatId, RULES);
            await this.bot.api.sendMessage(chatId, GREETING_MESSAGE);
            return;
        }
        if (infoMe?.status === NEEDED_STATUS && infoMe?.can_pin_messages) {
            await Chat.findOneAndUpdate({ chatId: chat.chatId }, { workStatus: true });
            await this.bot.api.sendMessage(chat.chatId, MESSAGE_AFTER_GETTING_NEEDED_STATUS);
        }
        else {
            await Chat.findOneAndUpdate({ chatId: chat.chatId }, { workStatus: false });
            await this.bot.api.sendMessage(chat.chatId, MESSAGE_AFTER_GETTING_BAD_STATUS);
        }
    };
    messageOnWrapperError = async (msg, error) => {
        if (msg) {
            await this.bot.api.sendMessage(msg?.chat?.id ?? '', MESSAGE_ON_WRAPPER_ERROR(error.message, error?.stack?.toString() ?? ''));
        }
        else {
            console.log('/ERR-01/Err with a router that hasn`t an access to the message object\n', MESSAGE_ON_WRAPPER_ERROR(error.message, error?.stack?.toString() ?? ''));
        }
    };
    checkWorkBotStatus = async (msg) => {
        let id;
        if (typeof msg === 'number') {
            id = msg;
        }
        else {
            id = msg?.chat?.id ?? '';
        }
        const chat = await Chat.findOne({ chatId: id });
        if (chat?.workStatus)
            return true;
        await this.bot.api.sendMessage(id, NOT_ENOUGH_RIGHTS);
        return false;
    };
    getUser = async (msgUser) => {
        const users = await User.find({
            userId: msgUser.userId,
        }).populate('chatIdCollection');
        const chat = await Chat.findOne({ chatId: msgUser.chatId });
        const user = users.find((user) => user?.chatIdCollection._id.toString() === chat?._id.toString());
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
                name: `${msgUser.firstName ?? ''} ${msgUser.lastName ?? ''}`.trimEnd(),
            });
            const user = newUser;
            user.chatIdCollection = chat;
            return user;
        }
        return user;
    };
}
