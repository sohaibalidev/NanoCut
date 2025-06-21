const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const config = require('../config/config');
const { getDB } = require('../config/db');

// Email transporter
const transporter = nodemailer.createTransport({
    service: config.EMAIL_SERVICE,
    auth: {
        user: config.EMAIL_USERNAME,
        pass: config.EMAIL_PASSWORD
    }
});

// Generate JWT token
function generateToken(payload, expiresIn = config.JWT_EXPIRES_IN) {
    return jwt.sign(payload, config.JWT_SECRET, { expiresIn });
}

// Verify JWT token
function verifyToken(token) {
    return jwt.verify(token, config.JWT_SECRET);
}

// Hash password
async function hashPassword(password) {
    return await bcrypt.hash(password, 10);
}

// Compare password
async function comparePassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
}

async function checkAuth(req) {
    try {
        const token = req.cookies.token;
        if (!token) return false;

        const decoded = verifyToken(token);
        const userEmail = decoded.email;

        const db = getDB();
        const users = db.collection('users');
        const user = await users.findOne({ email: userEmail });

        if (!user) return false;

        return true;
    } catch (err) {
        return false;
    }
}

// Send verification email
async function sendVerificationEmail(email, token) {
    const isDev = config.NODE_ENV === 'development';
    const verificationUrl = isDev
        ? `${config.BASE_URL}:${config.PORT}/verify?token=${token}`
        : `${config.BASE_URL}/verify?token=${token}`;

    const mailOptions = {
        from: `"Shortify" <${config.EMAIL_USERNAME}>`,
        to: email,
        subject: 'Verify Your Email Address',
        html: `
            <p>Hello,</p>
            <p>Please verify your email by clicking the button below:</p>
            <p>
                <a href="${verificationUrl}" style="padding: 10px 20px;background-color: #4f46e5;color: white;
                    text-decoration: none;border-radius: 4px;display: inline-block;">Verify Email</a>
            </p>
            <p>Or open this link: <br><a href="${verificationUrl}">${verificationUrl}</a></p>
            <p>This link will expire in 24 hours.</p>
            <p>If you did not request this, you can ignore this email.</p>
        `
    };

    await transporter.sendMail(mailOptions);
}

module.exports = {
    generateToken,
    verifyToken,
    hashPassword,
    comparePassword,
    sendVerificationEmail,
    checkAuth
};