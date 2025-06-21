/**
 * Email Verification Handler
 * Manages email verification flow including:
 * - Token verification from URL
 * - Status message display
 * - Theme management
 */
document.addEventListener('DOMContentLoaded', () => {
    // ====================== VERIFICATION LOGIC ======================
    const urlParams = new URLSearchParams(window.location.search);
    const messageElement = document.getElementById('verification-message');

    handleVerification(urlParams, messageElement);
    initTheme();
});

/**
 * Handles the email verification process
 */
function handleVerification(urlParams, messageElement) {
    const token = urlParams.get('token');
    const status = urlParams.get('status');
    const message = urlParams.get('message');

    if (token) {
        verifyToken(token, messageElement);
        return;
    }

    if (status === 'success') {
        notify('Email Verified!', 'success');
    } else if (status === 'error') {
        notify(decodeURIComponent(message || 'Verification Failed.'), 'error');
    }
}

/**
 * Verifies token with backend
 */
async function verifyToken(token, messageElement) {
    try {
        const response = await fetch(`/api/auth/verify?token=${encodeURIComponent(token)}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        window.location.href = `/verify?status=success&message=${encodeURIComponent(data.message)}`;
    } catch (err) {
        console.error('Verification error:', err);
        notify('Something went wrong', 'error');
    }
}

// ====================== THEME MANAGEMENT ======================
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';

    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.innerHTML = theme === 'dark' ? 'Light Mode' : 'Dark Mode';
    }
}