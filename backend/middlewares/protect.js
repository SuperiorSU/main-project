import jwt from 'jsonwebtoken';
import { Member } from '../models/memberModel.js';
import dotenv from 'dotenv';

dotenv.config();

export const protect = async (req, res, next) => {
  try {
    let token;
    
    // Check for token in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      try {
        // Get token from header
        token = req.headers.authorization.split(' ')[1];
        
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Get member from the token
        req.member = await Member.findById(decoded.id).select('-password');
        
        // Check if member is suspended or deleted
        if (req.member.isSuspended) {
          return res.status(403).json({ message: "Your account has been suspended" });
        }
        
        if (req.member.isDeleted) {
          return res.status(403).json({ message: "This account no longer exists" });
        }
        
        next();
      } catch (error) {
        console.error(error);
        res.status(401).json({ message: 'Not authorized, token failed' });
      }
    } else {
      res.status(401).json({ message: 'Not authorized, no token' });
    }
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const admin = async (req, res, next) => {
    if (req.member && req.member.isAdmin) {
      next();
    } else {
      res.status(401).json({ message: 'Not authorized as an admin' });
    }
  };