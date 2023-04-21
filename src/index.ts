import DietBotRoutes from './routes';

const dietBotRoutes = new DietBotRoutes();

dietBotRoutes.getFoodReport();
dietBotRoutes.answerOnFoodReport();
dietBotRoutes.setTimesOfPhysicalPunishment();
dietBotRoutes.checkChangingMyRights();
dietBotRoutes.addedToChat();
dietBotRoutes.joinedToChat();

console.log('Started');
