interface Config {
  server: {
    port: number;
    domain: string;
    log_level: string;
    session_secret: string;
  };
  db: {
    database: string;
    username: string;
    password: string;
    host: string;
    port: number;
  };
  auth: {
    api_id: string;
    api_key: string;
    rid: string;
  };
  email: string;
}

export default Config;
