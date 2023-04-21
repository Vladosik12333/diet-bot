import DietBotRoutes from './routes';
import express from 'express';

const dietBotRoutes = new DietBotRoutes();

dietBotRoutes.getFoodReport();
dietBotRoutes.answerOnFoodReport();
dietBotRoutes.setTimesOfPhysicalPunishment();
dietBotRoutes.checkChangingMyRights();
dietBotRoutes.addedToChat();
dietBotRoutes.joinedToChat();

console.log('Started');

const app = express();
app.listen(process.env.PORT);
