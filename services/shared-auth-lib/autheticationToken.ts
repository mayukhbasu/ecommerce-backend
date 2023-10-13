import express, { NextFunction, Request, Response } from 'express';
import User, { IUser } from './User';

export const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log(req.cookies)
    const userId = req.cookies['userId'];
    if(!userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const user: IUser | null = await User.findById(userId);
    if (!user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    (req as any).user = user;
    next();
  } catch(err) {
    console.log(err)
    res.status(500).json({ error: 'Server error' });
  }
}