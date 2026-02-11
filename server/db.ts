import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI;
    if (!mongoURI || mongoURI.includes('<password>')) {
      console.warn("Review your .env file: MONGO_URI is missing or contains placeholders.");
    }

    try {
      const conn = await mongoose.connect(mongoURI!, {
        serverSelectionTimeoutMS: 5000,
      });
      console.log(`MongoDB Connected: ${conn.connection.host}`);
      return true;
    } catch (innerError) {
      // Explicitly catch the connection error
      throw innerError;
    }

  } catch (error) {
    console.warn(`\n*** MongoDB Connection Failed ***`);
    console.warn(`The server will run in "Offline Mode". Data will not be saved persistently.`);
    console.warn(`Error: ${(error as Error).message}\n`);
    return false;
  }
};

mongoose.connection.on('error', (err) => {
  console.warn('MongoDB connection error:', err);
});
