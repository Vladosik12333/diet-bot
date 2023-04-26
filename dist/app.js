import DietBotRoutes from './routes/dietBot';
import { Bot, webhookCallback } from 'grammy';
import { token, port, domain } from './config';
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
    app.listen(port, async () => {
        await bot.api.setWebhook(`https://${domain}/${token}`);
        console.log('Bot started');
    });
}