import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB, prisma } from './db';
import type { NextFunction, Request, Response } from 'express';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT || 5002);

// Middleware
const allowedOrigins = (process.env.CORS_ORIGIN || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

app.use(cors({
    origin: allowedOrigins.length > 0 ? allowedOrigins : true,
    credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

const startServer = async () => {
    try {
        await connectDB();
        const server = app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
        server.on('error', (err) => {
            console.error('Server error:', err);
        });

        const shutdown = async (signal: string) => {
            console.log(`Received ${signal}. Shutting down gracefully...`);
            try {
                await prisma.$disconnect();
            } catch (error) {
                console.error('Prisma disconnect error:', error);
            } finally {
                server.close(() => process.exit(0));
            }
        };

        process.on('SIGINT', () => void shutdown('SIGINT'));
        process.on('SIGTERM', () => void shutdown('SIGTERM'));
    } catch (err) {
        console.error('Failed to start server:', err);
        process.exit(1);
    }
};

// Routes
import authRoutes from './routes/auth';
import scanRoutes from './routes/scan';

app.use('/api/auth', authRoutes);
app.use('/api/scan', scanRoutes);

app.get('/', (req, res) => {
    res.send('DeepDetect AI API is running...');
});

app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error('Unhandled request error:', err);
    res.status(500).json({ message: 'Internal server error' });
});

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
