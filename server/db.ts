import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI;
    if (!mongoURI || mongoURI.includes('<password>')) {
      console.warn("Review your .env file: MONGO_URI is missing or contains placeholders.");
    }

    const conn = await mongoose.connect(mongoURI || 'mongodb://localhost:27017/deepdetect', {
      serverSelectionTimeoutMS: 5000 // Timeout after 5s instead of 30s
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.warn(`\n*** MongoDB Connection Failed ***`);
    console.warn(`The server will run in "Offline Mode". Data will not be saved persistently.`);
    console.warn(`Error: ${(error as Error).message}\n`);
    return false;
  }
};
