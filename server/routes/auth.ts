import express from 'express';
import { prisma } from '../db';
import { hashPassword, isHashedPassword, normalizeEmail, verifyPassword } from '../utils/password';
import { fallbackStore } from '../utils/fallbackStore';

const router = express.Router();

router.post('/register', async (req, res) => {
    const { name, email, password } = req.body ?? {};
    try {
        const trimmedName = typeof name === 'string' ? name.trim() : '';
        const normalizedEmail = typeof email === 'string' ? normalizeEmail(email) : '';
        const rawPassword = typeof password === 'string' ? password : '';

        if (!trimmedName || !normalizedEmail || !rawPassword) {
            return res.status(400).json({ message: 'Name, email, and password are required' });
        }

        let userExists = null;
        try {
            userExists = await prisma.user.findUnique({ where: { email: normalizedEmail } });
        } catch {
            userExists = fallbackStore.findUserByEmail(normalizedEmail);
        }
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        let hashedPassword = '';
        try {
            hashedPassword = hashPassword(rawPassword);
        } catch (error) {
            console.error("Password Hash Error:", error);
            return res.status(400).json({ message: 'Invalid password format' });
        }
        let user;
        try {
            user = await prisma.user.create({
                data: {
                    name: trimmedName,
                    email: normalizedEmail,
                    password: hashedPassword,
                }
            });
        } catch {
            user = fallbackStore.createUser({
                name: trimmedName,
                email: normalizedEmail,
                password: hashedPassword,
            });
        }

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
    const { email, password } = req.body ?? {};
    try {
        const normalizedEmail = typeof email === 'string' ? normalizeEmail(email) : '';
        const rawPassword = typeof password === 'string' ? password : '';

        if (!normalizedEmail || !rawPassword) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        let user = null;
        try {
            user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
        } catch {
            user = fallbackStore.findUserByEmail(normalizedEmail);
        }
        if (!user) {
            return res.status(401).json({ message: 'No account found for this email' });
        }

        let isValidPassword = false;
        try {
            const storedPassword = typeof user.password === 'string' ? user.password : '';
            isValidPassword = verifyPassword(rawPassword, storedPassword);
        } catch (error) {
            console.error("Password Verify Error:", error);
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Incorrect password' });
        }

        const storedPassword = typeof user.password === 'string' ? user.password : '';
        if (!isHashedPassword(storedPassword)) {
            let updatedPassword = '';
            try {
                updatedPassword = hashPassword(rawPassword);
            } catch (error) {
                console.error("Password Rehash Error:", error);
                return res.status(401).json({ message: 'Invalid credentials' });
            }
            try {
                await prisma.user.update({
                    where: { id: user.id },
                    data: { password: updatedPassword }
                });
            } catch {
                fallbackStore.updateUserPassword(user.id, updatedPassword);
            }
        }

        res.json({
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

export default router;
