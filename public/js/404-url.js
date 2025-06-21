// Theme toggle functionality
document.getElementById('theme-toggle').addEventListener('click', () => {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);

    // Update icon
    const icon = document.querySelector('#theme-toggle i');
    icon.className = newTheme === 'dark' ? 'bxr bx-moon' : 'bxr bx-sun-dim';
});

// Set initial theme
const savedTheme = localStorage.getItem('theme') ||
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
document.documentElement.setAttribute('data-theme', savedTheme);
const icon = document.querySelector('#theme-toggle i');
icon.className = savedTheme === 'dark' ? 'bxr bx-moon' : 'bxr bx-sun-dim';