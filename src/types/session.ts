declare module 'express-session' {
  interface SessionData {
    usr?: string;
    auth?: boolean;
    state?: string;
    route?: string;
    ts?: number;
  }
}

export {};
