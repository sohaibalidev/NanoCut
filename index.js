// ====================== IMPORTS ======================
const cors = require('cors');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { connectDB } = require('./src/config/db');
const config = require('./src/config/config');
const auth = require('./src/utils/auth');

// Route imports
const urlRoutes = require('./src/routes/urlRoutes');
const authRoutes = require('./src/routes/authRoutes');
const { redirectToOriginal } = require('./src/controllers/urlController');

// ====================== INITIALIZATION ======================
const app = express();

// ====================== MIDDLEWARE SETUP ======================
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors({
    origin: config.BASE_URL,
    credentials: true
}));
app.use(express.static(path.join(__dirname, 'public')));

// ====================== ROUTES ======================
app.use('/api/', urlRoutes);
app.use('/api/auth', authRoutes);

app.get('/u/:shortId', redirectToOriginal);

// ====================== VIEW ROUTES ======================
/**
 * Home Route - Redirects to dashboard if authenticated
 */
app.get('/', async (req, res) => {
    const isAuth = await auth.checkAuth(req);
    if (isAuth) return res.redirect('/dashboard');
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

/**
 * Registration Route - Redirects to dashboard if authenticated
 */
app.get('/register', async (req, res) => {
    const isAuth = await auth.checkAuth(req);
    if (isAuth) return res.redirect('/dashboard');
    res.sendFile(path.join(__dirname, 'views', 'register.html'));
});

/**
 * Login Route - Redirects to dashboard if authenticated
 */
app.get('/login', async (req, res) => {
    const isAuth = await auth.checkAuth(req);
    if (isAuth) return res.redirect('/dashboard');
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

/**
 * Verification Route - Redirects to dashboard if authenticated
 */
app.get('/verify', async (req, res) => {
    const isAuth = await auth.checkAuth(req);
    if (isAuth) return res.redirect('/dashboard');
    res.sendFile(path.join(__dirname, 'views', 'verify.html'));
});

/**
 * Dashboard Route - Requires authentication
 */
app.get('/dashboard', async (req, res) => {
    const isAuth = await auth.checkAuth(req);
    if (!isAuth) return res.redirect('/login');
    res.sendFile(path.join(__dirname, 'views', 'dashboard.html'));
});

// ====================== ERROR HANDLING ======================
// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        status: 404,
        error: 'Not Found',
        method: req.method,
        path: req.originalUrl,
    });
});

// ====================== SERVER STARTUP ======================
connectDB()
    .then(() => {
        app.listen(config.PORT, () => {
            const isDev = config.NODE_ENV === 'development'
            const serverUrl = isDev
                ? `${config.BASE_URL}:${config.PORT}`
                : `${config.PORT}`
            console.log(`Server running on ${serverUrl}`);
        });
    })
    .catch((err) => {
        console.error('Failed to connect to DB:', err);
        process.exit(1);
    });