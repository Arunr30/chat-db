import express from 'express'
import authRoutes from  "./src/routes/auth.route.js"
import messageRoutes from  "./src/routes/message.route.js"
import dotenv from "dotenv"
import {connectToDB} from "./src/lib/db.js"
import cookieParser from 'cookie-parser'
const app = express();
dotenv.config()

const PORT = process.env.PORT // we can define wherever we want
app.use(express.json())
app.use(cookieParser())
app.use('/api/auth', authRoutes) // auth routes is just a varaible name.
app.use('/api/auth', messageRoutes)

app.listen(PORT, () => {
    console.log('port is listening to' + PORT)
    connectToDB()
})