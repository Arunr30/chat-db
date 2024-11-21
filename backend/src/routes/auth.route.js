import express from "express"
import { login, logout, signup } from "../controllers/auth.controller.js";


// creating a router
const router = express.Router();

// routes
router.post('/signup', signup)
router.post('/login', login)
router.post('/logout', logout)

export default router