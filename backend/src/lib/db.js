import mongoose from "mongoose";

export const connectToDB = async () => {
    try {
        // Connect to MongoDB
        const conn = await mongoose.connect(process.env.MONGO_URL);
        console.log(`Connected to MongoDB: ${conn.connection.host}`);
    } catch (error) {
        console.error('Connection failed:', error.message);
        process.exit(1); // Terminate the app on failure
    }
};
