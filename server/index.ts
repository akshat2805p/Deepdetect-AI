import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './db';

dotenv.config();

const app = express();
const PORT = 5002; // Force new port for stability check

// Middleware
app.use(cors());
app.use(express.json());

// Keep process alive to prevent exit on DB failure (Offline Mode)
setInterval(() => {
    // Heartbeat
}, 10000);

const startServer = () => {
    try {
        const server = app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
        server.on('error', (err) => {
            console.error('Server error:', err);
        });
    } catch (err) {
        console.error('Failed to start server:', err);
    }
};



// Database Connection
connectDB();
// console.log("Database connection disabled for stability check.");

// Routes
import authRoutes from './routes/auth';
import scanRoutes from './routes/scan';

app.use('/api/auth', authRoutes);
app.use('/api/scan', scanRoutes);

app.get('/', (req, res) => {
    res.send('DeepDetect AI API is running...');
});

// Middleware and Routes are defined above.

if (require.main === module) {
    startServer();
} else {
    // For Vercel/Tests
    console.log("Module loaded via import.");
}

// Global Error Handlers

// Prevent crash on unhandled rejection
process.on('unhandledRejection', (err) => {
    console.log('UNHANDLED REJECTION! 💥 Server running in fallback mode.');
    console.log(err);
});

process.on('uncaughtException', (err) => {
    console.log('UNCAUGHT EXCEPTION! 💥 Server running in fallback mode.');
    console.log(err);
});

export default app;
