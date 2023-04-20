import dotenv from 'dotenv';
dotenv.config();

const { TOKEN: token = '' } = process.env;

export { token };
