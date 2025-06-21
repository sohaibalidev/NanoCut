const express = require('express');
const router = express.Router();

const { register, verifyEmail, login, logout } = require('../controllers/authControllers');

router.post('/login', login);
router.post('/logout', logout);
router.post('/register', register);
router.get('/verify', verifyEmail);

module.exports = router;