import { generateToken } from '../lib/util.js';
import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';

export const signup = async (req, res) => {
  const { email, fullName, password } = req.body;
  try {
    // another check to require all fields
    if(!email || !fullName || !password) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }
    // Check password length
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    // Check if email already exists
    const user = await User.findOne({ email });
    if (user) {
      return res.json({ message: 'Email already exists!' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const newUser = await User.create({
      email,
      fullName,
      password: hashedPassword,
    });

    if (newUser) {
      // Generate token
      generateToken(newUser._id, res);

      // Save new user to the database
      await newUser.save();

      return res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        password: newUser.password,
        profilePic: newUser.profilePic,
      });
    } else {
      return res.json({ message: 'User creation failed' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error occurred' });
  }
};



export const login = async(req, res) => {
    res.send('login route')
}

export const logout = async(req, res) => {
    res.send('logout route')
}

