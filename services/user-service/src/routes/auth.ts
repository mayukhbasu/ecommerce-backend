import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';

import User, { IUser } from '../models/User';
import { authenticateUser } from '../middleware/authenticateToken';

const router = express.Router();
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD
  }
})

router.post('/register', async (req: Request, res: Response) => {
  try {
    const {username, email, password} = req.body as IUser;
    const userExists = await User.findOne({email});
    if(userExists) {
      return res.status(400).json({ error: 'User already exists' });
    }
    const user:IUser = new User({username, email, password});
    await user.save();
    // const mailOptions = {
    //   from: process.env.EMAIL,
    //   to: req.body.email,
    //   subject: 'Please verify your email address',
    //   text: 'Thanks for registering! Please verify your email address by clicking on the following link: [verification_link_here]'
    // }
    // transporter.sendMail(mailOptions, (error, info) => {
    //   if(error){
    //     console.log(error);
    //     res.status(500).json({ error: 'Failed to send verification email' });
    //     } else {
    //       console.log('Email sent: ' + info.response);
    //       res.status(201).json({ message: 'User registered successfully and verification email sent' });
    //     }
    // })
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
    (req.session as any).userId = user.username;
    res.cookie('userId', user._id, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000 // Optional: sets the cookie to expire in 1 day
    });
    res.json({ message: "Logged in successfully" });
  } catch(err) {
    console.log(err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router