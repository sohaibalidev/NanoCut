require('dotenv').config();

module.exports = {
    PORT: process.env.PORT || 3000,
    BASE_URL: process.env.BASE_URL || 'http://192.168.100.4',
    NODE_ENV: process.env.NODE_ENV || 'development',
    DB_NAME: process.env.DB_NAME,
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/url_shortener',
    JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key',
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1d',
    EMAIL_SERVICE: process.env.EMAIL_SERVICE || 'gmail',
    EMAIL_USERNAME: process.env.EMAIL_USERNAME || 'your-email@gmail.com',
    EMAIL_PASSWORD: process.env.EMAIL_PASSWORD || 'your-email-password'
};