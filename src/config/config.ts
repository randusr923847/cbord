interface Config {
  server: {
    port: number;
    domain: string;
  };
  db: {
    database: string;
    username: string;
    password: string;
    host: string;
    port: number;
  };
}

export default Config;
