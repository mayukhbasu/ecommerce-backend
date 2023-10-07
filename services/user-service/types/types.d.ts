import session from 'express-session';

declare module 'express-session' {
  interface SessionData {
    userId?: string; // or whatever type your userId is
    // add other custom session properties if needed
  }
}