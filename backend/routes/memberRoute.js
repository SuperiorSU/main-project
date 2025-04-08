import express from 'express';
import { 
  registerMember,
  loginMember,
  getProfile,
  updateProfile
} from '../controllers/memberController.js';
import {protect} from '../middlewares/protect.js';

const memberRouter = express.Router();

// Public routes
memberRouter.post('/register', registerMember);
memberRouter.post('/login', loginMember);

// Protected routes - require authentication
memberRouter.get('/profile', protect, getProfile);
memberRouter.put('/profile', protect, updateProfile);

// Route to verify email 
// This would be needed for the verification link in the registration email
memberRouter.get('/verify/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const member = await Member.findOne({ verificationToken: token });
    
    if (!member) {
      return res.status(400).json({ message: 'Invalid verification token' });
    }
    
    member.isVerified = true;
    member.verificationToken = undefined; // Clear the token after use
    await member.save();
    
    res.status(200).json({ message: 'Email verified successfully. You can now login.' });
  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default memberRouter;