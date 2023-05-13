import DietBotRoutes from './routes/dietBot';
import { Bot, webhookCallback } from 'grammy';
import { token, port, domain, env } from './config';
import express from 'express';
import axios from 'axios';

export default function startBot() {
    const bot = new Bot(token);

    const app = express();

    app.use(express.json());
    app.use(webhookCallback(bot, 'express'));

    const dietBotRoutes = new DietBotRoutes(bot);

    dietBotRoutes.getFoodReport();
    dietBotRoutes.answerOnFoodReport();
    dietBotRoutes.setTimesOfPhysicalPunishment();
    dietBotRoutes.checkChangingMyRights();
    dietBotRoutes.getMessageStart();

    if (env === 'DEV') {
        bot.start();
        console.log('Bot started:dev');
        return;
    }

    app.listen(port, async () => {
        interface IResponseBotWebhook {
            ok: boolean;
            result: boolean;
            description: string;
        }

        const response = await axios<IResponseBotWebhook>(
            `https://api.telegram.org/bot${token}/deleteWebhook`
        );

        if (response.data.ok && response.data.result) {
            const response = await axios<IResponseBotWebhook>(
                `https://api.telegram.org/bot${token}/setWebhook?url=https://${domain}`
            );

            if (response.data.ok && response.data.result) {
                console.log('Bot started:prod');
                return;
            }
        }

        process.exit(2);
    });
}
