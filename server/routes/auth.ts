import express from 'express';
import { User } from '../models/User';
import mongoose from 'mongoose';

const router = express.Router();

// Register Mock
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        if (mongoose.connection.readyState !== 1) {
            // Fallback for offline mode
            return res.status(201).json({
                _id: 'offline_user_id',
                name,
                email,
                token: 'mock-jwt-token-offline'
            });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const user = await User.create({ name, email, password });
        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            token: 'mock-jwt-token'
        });
    } catch (error) {
        console.error("Auth Error:", error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Login Mock
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        if (mongoose.connection.readyState !== 1) {
            // Fallback for offline mode (Allow any login)
            return res.json({
                _id: 'offline_user_id',
                name: 'Offline User',
                email,
                token: 'mock-jwt-token-offline'
            });
        }

        const user = await User.findOne({ email });
        if (user && user.password === password) { // Plaintext for demo as requested
            res.json({
                _id: user.id,
                name: user.name,
                email: user.email,
                token: 'mock-jwt-token'
            });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
