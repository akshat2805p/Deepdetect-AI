import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const uri = process.env.MONGO_URI || '';
console.log("Testing connection to:", uri.replace(/:([^@]+)@/, ':****@')); // Hide password

mongoose.connect(uri)
    .then(() => {
        console.log("Successfully connected to MongoDB!");
        process.exit(0);
    })
    .catch((err) => {
        console.error("Connection failed:", err);
        process.exit(1);
    });
