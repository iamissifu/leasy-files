import express from 'express';
import User from '../models/User.js'; // Assuming User model is in User.js
import bcrypt from 'bcrypt';

const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        // Hash the password before saving it to the database
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, email, password: hashedPassword });
        await user.save();
        res.status(201).json({ message: 'Registration successful' });
    } catch (error) {
        res.status(500).json({ error: 'Registration failed' });
    }
});

export default router;
