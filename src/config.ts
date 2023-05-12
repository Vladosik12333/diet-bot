import dotenv from 'dotenv';
dotenv.config();

const {
    TOKEN: token = '',
    PORT: port = 3333,
    DB_HOST: dbHost = '',
    DOMAIN: domain = '',
    ENV: env = 'PROD'
} = process.env;

export { token, port, dbHost, domain, env };
