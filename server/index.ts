import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
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

// Routes
import scanRoutes from './routes/scan';

app.use('/api/scan', scanRoutes);

app.get('/', (_req, res) => {
    res.send('DeepDetect AI API is running...');
});

app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error('Unhandled request error:', err);
    res.status(500).json({ message: 'Internal server error' });
});

const startServer = () => {
    const server = app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });

    server.on('error', (err) => {
        console.error('Server error:', err);
    });

    const shutdown = (signal: string) => {
        console.log(`Received ${signal}. Shutting down gracefully...`);
        server.close(() => process.exit(0));
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
};

if (require.main === module) {
    startServer();
} else {
    console.log("Module loaded via import.");
}

process.on('unhandledRejection', (err) => {
    console.log('UNHANDLED REJECTION! 💥 Server running in fallback mode.');
    console.log(err);
});

process.on('uncaughtException', (err) => {
    console.log('UNCAUGHT EXCEPTION! 💥 Server running in fallback mode.');
    console.log(err);
});

export default app;
