import express, { Request, Response } from 'express';

import { authenticateUser, IUser, User }  from 'shared-auth-lib'; 

const router = express.Router();

router.get('/profile', authenticateUser, async(req: Request, res: Response) => {
  try {
    const user:IUser = req.user!;
    res.json({
      username: user.username,
      email: user.email,
    })
  } catch(err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
  
});

router.put('/profile', authenticateUser, async (req: Request, res: Response) => {
  try {
      const user: IUser = req.user!;
      const { username, email } = req.body;  // You can extract other fields as necessary

      if (username) {
          user.username = username;
      }
      if (email) {
          user.email = email;
      }

      // Save the updated user details
      await user.save();

      res.json({
          message: 'Profile updated successfully',
          updatedProfile: {
              username: user.username,
              email: user.email,
              // Return any other updated fields
          }
      });

  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
  }
});

export default router;

