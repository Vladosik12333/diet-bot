import { dbHost, port } from './config';
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
