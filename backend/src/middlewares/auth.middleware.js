import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    
    // Check if the token is present
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find the user by ID
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Attach the user to the request object
    req.user = user;
    
    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    console.error('Error in protectRoute middleware:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};
