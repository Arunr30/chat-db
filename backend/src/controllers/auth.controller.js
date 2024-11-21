import cloudinary from '../lib/cloudinary.js';
import { generateToken } from '../lib/util.js';
import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';

export const signup = async (req, res) => {
  const { email, fullName, password } = req.body;
  try {
    // Another check to require all fields
    if (!email || !fullName || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check password length
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    // Check if email already exists
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'Email already exists!' });
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

    // Generate token
    generateToken(newUser._id, res);

    // Save new user to the database (although .create() already saves it)
    // await newUser.save();  // This line is redundant

    return res.status(201).json({
      _id: newUser._id,
      fullName: newUser.fullName,
      profilePic: newUser.profilePic,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error occurred' });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Compare the password
    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if (!isPasswordMatched) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate token
    generateToken(user._id, res);

    return res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.log('Error in login controller', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const logout = async (req, res) => {
  try {
    // Clear the JWT cookie
    res.cookie("jwt", "", { maxAge: 0 });

    // Send response
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    console.log('Error in logout route', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const {profilePic} = req.body
    const userId = req.user._id
    if(!profilePic) {
      res.status(400).json({message: 'Profile pic is required'})
    }
    const uploadResponse = await cloudinary.uploader.upload(profilePic)
    const updateUser = await User.findByIdAndUpdate(userId, {profilePic: uploadResponse.secure_url}, {new: true})
    res.status(200).json(updateUser)
  } catch (error) {
    console.log('error in update profile: ', error)
    res.status(404).json({message:"invalid error"})
  }
}

export const checkAuth = async(req, res) => {
  try {
    res.status(200).json(req.user)
  } catch (error) {
    console.log("Error in checkAuth controller", error.message)
    res.status(500).json({message: 'Internal servor error'})
  }
}