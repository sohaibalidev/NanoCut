const { getDB } = require('../config/db');
const auth = require('../utils/auth');

exports.register = async (req, res) => {
    try {
        const { username, email, password, confirmPassword } = req.body;

        if (!username || !email || !password || !confirmPassword) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ error: 'Passwords do not match' });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters' });
        }

        const db = getDB();
        const users = db.collection('users');
        const urls = db.collection('urls');

        const existingUser = await users.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ error: 'Username or email already exists' });
        }

        const hashedPassword = await auth.hashPassword(password);
        const newUser = {
            username,
            email,
            password: hashedPassword,
            isActive: false,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        await users.insertOne(newUser);

        const token = auth.generateToken({ email }, '1d');

        await auth.sendVerificationEmail(email, token);

        res.status(201).json({ message: 'Registration successful. Please check your email for verification.' });
    } catch (err) {
        console.error('Registration error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const db = getDB();
        const users = db.collection('users');

        const user = await users.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        if (!user.isActive) {
            return res.status(401).json({ error: 'Account not verified. Please check your email.' });
        }

        const isMatch = await auth.comparePassword(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = auth.generateToken({ email: user.email.toString() });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000
        });

        res.json({ message: 'Login successful', user: { username: user.username, email: user.email } });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

exports.logout = (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Logout successful' });
}

exports.verifyEmail = async (req, res) => {
    try {
        const { token } = req.query;

        if (!token) {
            return res.redirect('/verify?status=error&message=Token+is+required');
        }

        const decoded = auth.verifyToken(token);
        const userId = decoded.email;

        const db = getDB();
        const users = db.collection('users');

        await users.updateOne(
            { email: userId },
            { $set: { isActive: true, updatedAt: new Date() } }
        );

        res.redirect('/verify?status=success');
    } catch (err) {
        console.error('Verification error:', err);
        res.redirect('/verify?status=error&message=' + encodeURIComponent(err.message));
    }
}
