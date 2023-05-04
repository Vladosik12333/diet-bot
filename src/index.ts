import { dbHost } from './config';
import mongoose from 'mongoose';
import startBot from './app';

mongoose
    .connect(dbHost)
    .then(() => {
        console.log('Database connection successful');
        startBot();
    })
    .catch((err) => {
        console.log('Error with connect to database', err);
        process.exit(1);
    });

/**
@Console command to set up the webhook for Telegram - 
curl "https://api.telegram.org/bot$TELEGRAM_API_TOKEN/setWebhook?url=$TELEGRAM_WEBHOOK_URL"
*/
