import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';

const router = express.Router();

router.post('/register', async (req: Request, res: Response) => {
  try {
    const {username, email, password} = req.body as IUser;
    const userExists = await User.findOne({email});
    if(userExists) {
      return res.status(400).json({ error: 'User already exists' });
    }
    const user:IUser = new User({username, email, password});
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });

  } catch(err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/login', async (req: Request, res: Response) => {
  try {
    const {email, password} = req.body;
    const user: IUser | null = await User.findOne({email});
    if(!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    const isMatch: boolean = await bcrypt.compare(password, user.password);
    if(!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    const token: string = jwt.sign({id: user._id}, 'SECRET', { expiresIn: '1h' });
    res.json({token, user: {id: user._id, email: user.email, username: user.username}});
  } catch(err) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router