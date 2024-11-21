import { json } from "express";
import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";

export const getUsersFromSidebar = async(req, res) => {
  try {
    const loggedInUser = req.user._id;
    const filteredUser = await User.find({_id: {$ne: loggedInUser}}).select("-password")
    res.status(200).json(filteredUser)
  } catch (error) {
    console.error("Errir in getUsersForSidebar: ", error.message);
    res.status(500).json({message: 'internal server error'})
  }
}

export const getMessages = async(req, res) => {
  try {
    const {id: userToChatId} = req.params
    const myId = req.user._id
    const messages = await Message.find({
      $or:[
        {senderId: myId, receiverId: userToChatId},
        {senderId: userToChatId,  receiverId: myId}
      ]
    });
    res.status(200).json(messages)
  } catch (error) {
    console.log('Internal server error', error)
    res.status(500).json({message: 'internal server error'})
  }
}

export const sendMessage = async(req, res) => {
  try {
    const {text, image} = req.body
    const {id: receiverId} = req.params;
    const senderId = req.user._id;

    let imageUrl;
    if(image) {
      const uploadResponse = await cloudinary.uploader.upload(image)
      imageUrl = uploadResponse.secure_url
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl
    })
    await newMessage.save();

    // realtime functionality here

    res.status(201).json(newMessage)
  } catch (error) {
    console.log('Error in messageController:' , error)
    res.status(500).send('Internal server error')
  }
}