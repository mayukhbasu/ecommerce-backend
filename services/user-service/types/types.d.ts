import session from 'express-session';
import { IUser } from '../models/User'; 

declare module 'express-session' {
  export interface SessionData {
    userId?: string; // or whatever type your userId is
    // add other custom session properties if needed
  }
}

declare module 'express' {
  export interface Request {
    user?: IUser;
  }
}