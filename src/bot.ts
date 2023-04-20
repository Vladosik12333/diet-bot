import { token } from './config';
import { Telegraf } from 'telegraf';
import { message } from 'telegraf/filters';

export default class setupBot {
    bot = new Telegraf(token);

    checkFood() {
        this.bot.start((ctx) => ctx.reply('Welcome'));
        this.bot.launch();
    }
}
