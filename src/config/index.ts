import Config from './config';
import dotenv from 'dotenv';

dotenv.config();

const config: Config = {
  server: {
    port: parseInt(process.env.PORT as string),
    domain: process.env.HOST as string,
  },
  db: {
    database: process.env.DB_NAME as string,
    username: process.env.DB_USER as string,
    password: process.env.DB_PW as string,
    host: process.env.DB_HOST as string,
    port: parseInt(process.env.DB_PORT as string),
  },
};

export default config;
