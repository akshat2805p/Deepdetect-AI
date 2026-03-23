import express from 'express';
import { prisma } from '../db';

const router = express.Router();

router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const userExists = await prisma.user.findUnique({ where: { email } });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const user = await prisma.user.create({ data: { name, email, password } });
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

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await prisma.user.findUnique({ where: { email } });
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
        console.error("Auth Error:", error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
