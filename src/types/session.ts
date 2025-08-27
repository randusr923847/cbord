declare module 'express-session' {
  interface SessionData {
    usr?: string;
    auth?: boolean;
    state?: string;
  }
}

export {};
