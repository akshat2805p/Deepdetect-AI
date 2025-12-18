import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './db';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
connectDB();

// Routes
import authRoutes from './routes/auth';
import scanRoutes from './routes/scan';

app.use('/api/auth', authRoutes);
app.use('/api/scan', scanRoutes);

app.get('/', (req, res) => {
    res.send('DeepDetect AI API is running...');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
