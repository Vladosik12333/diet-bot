import { token } from './config';
import TelegramBot from 'node-telegram-bot-api';

export default class setupBot {
    private bot = new TelegramBot(token, { polling: true });

    checkFood() {
        this.bot.on('message', (msg) => {
            console.log(msg);
            this.bot.sendMessage(msg.chat.id, 'here');
        });
    }
}
