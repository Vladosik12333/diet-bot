import DietBotRoutes from './routes/dietBot';

const dietBotRoutes = new DietBotRoutes();

export default function startBot() {
    dietBotRoutes.getFoodReport();
    dietBotRoutes.answerOnFoodReport();
    dietBotRoutes.setTimesOfPhysicalPunishment();
    dietBotRoutes.checkChangingMyRights();
    dietBotRoutes.addedToChat();
    dietBotRoutes.joinedToChat();

    console.log('Bot started');
}
