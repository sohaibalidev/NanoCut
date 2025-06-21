// Theme management
function toggleTheme() {
    const currentTheme = localStorage.getItem('theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    updateThemeIcon(newTheme);
}

function applySavedTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

function updateThemeIcon(theme) {
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.innerHTML = theme === 'dark'
            ? "<i class='bxr bx-sun-dim'></i>"
            : "<i class='bxr bx-moon'></i> ";
    }
}

// Initialize theme on page load
applySavedTheme();

// Helper function to handle API errors
function handleApiError(error, alertId = 'alert') {
    console.error('API Error:', error);
    const alertElement = document.getElementById(alertId);
    if (alertElement) {
        alertElement.textContent = error.message || 'An error occurred';
        alertElement.style.display = 'block';
        setTimeout(() => {
            alertElement.style.display = 'none';
        }, 5000);
    }
}

// Helper function to format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
}

// Helper function to check if URL is valid
function isValidUrl(url) {
    try {
        new URL(url);
        return true;
    } catch (err) {
        return false;
    }
}

// Export functions
export {
    toggleTheme,
    applySavedTheme,
    handleApiError,
    formatDate,
    isValidUrl
};