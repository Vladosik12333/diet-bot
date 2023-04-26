import DietBotRoutes from './routes/dietBot';
import { Bot, webhookCallback } from 'grammy';
import { token, port } from './config';
import express from 'express';

export default function startBot() {
    const bot = new Bot(token);

    const app = express();

    app.use(express.json());
    app.use(`/${token}`, webhookCallback(bot, 'express'));

    const dietBotRoutes = new DietBotRoutes(bot);

    dietBotRoutes.getFoodReport();
    dietBotRoutes.answerOnFoodReport();
    dietBotRoutes.setTimesOfPhysicalPunishment();
    dietBotRoutes.checkChangingMyRights();

    bot.start();

    // app.listen(port, async () => {
    //     bot.api.setWebhook(`http://localhost/${token}`);
    //     console.log('Bot started');
    // });
}
