import express, { NextFunction, Request, Response } from 'express';
import User, { IUser } from '../models/User';

export const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.cookies['userId'];
    if(!userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const user: IUser | null = await User.findById(userId);
    if (!user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    req.user = user;
    next();
  } catch(err) {
    res.status(500).json({ error: 'Server error' });
  }
}