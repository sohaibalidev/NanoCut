import { toggleTheme, handleApiError } from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
    // Theme toggle
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }

    // Register form
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const username = document.getElementById('username').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            // Client-side validation
            if (password !== confirmPassword) {
                handleApiError({ message: 'Passwords do not match' });
                return;
            }

            if (password.length < 6) {
                handleApiError({ message: 'Password must be at least 6 characters' });
                return;
            }

            try {
                const response = await fetch('/api/auth/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username, email, password, confirmPassword })
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || 'Registration failed');
                }

                // Show success message
                const alertElement = document.getElementById('alert');
                alertElement.textContent = data.message;
                alertElement.className = 'alert alert-success';
                alertElement.style.display = 'block';

                // Clear form
                registerForm.reset();
            } catch (err) {
                handleApiError(err);
            }
        });
    }

    // Login form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                const response = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password }),
                    credentials: 'include'
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || 'Login failed');
                }

                // Redirect to dashboard
                window.location.href = '/dashboard';
            } catch (err) {
                handleApiError(err);
            }
        });
    }

    // Show verification success message on login page
    if (window.location.pathname === '/login') {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('verified')) {
            const alertElement = document.getElementById('alert');
            alertElement.textContent = 'Email verified successfully. You can now log in.';
            alertElement.className = 'alert alert-success';
            alertElement.style.display = 'block';
        }
    }
});