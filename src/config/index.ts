import Config from './config';
import dotenv from 'dotenv';

dotenv.config();

const config: Config = {
  server: {
    port: parseInt(process.env.PORT as string),
    domain: process.env.HOST as string,
    log_level: process.env.LOG_LEVEL as string,
    session_secret: process.env.SESSION_SECRET as string,
  },
  db: {
    database: process.env.DB_NAME as string,
    username: process.env.DB_USER as string,
    password: process.env.DB_PW as string,
    host: process.env.DB_HOST as string,
    port: parseInt(process.env.DB_PORT as string),
  },
  auth: {
    api_id: process.env.MYST_AUTH_ID as string,
    api_key: process.env.MYST_AUTH_KEY as string,
    rid: process.env.MYST_AUTH_RID as string,
  },
  email: process.env.EMAIL as string,
};

export default config;
