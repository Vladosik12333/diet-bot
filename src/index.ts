// import from ('./app');
import { dbHost, port } from './config';
import mongoose from 'mongoose';
import startBot from './app';

mongoose
    .connect(dbHost)
    .then(() => {
        console.log('Database connection successful');
        startBot();
        // app.listen(PORT, () => {
        //     console.log(`Server running. Use our API on port: ${PORT}`);
        // });
    })
    .catch((err) => {
        console.log('Error with connect to database', err);
        process.exit(1);
    });
