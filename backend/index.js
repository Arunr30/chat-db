import express from 'express'
import authRoutes from  "./src/routes/auth.route.js"
import dotenv from "dotenv"
import {connectToDB} from "./src/lib/db.js"
const app = express();
dotenv.config()

const PORT = process.env.PORT // we can define wherever we want
app.use(express.json())
app.use('/api/auth', authRoutes) // auth routes is just a varaible name.

app.listen(PORT, () => {
    console.log('port is listening to' + PORT)
    connectToDB()
})