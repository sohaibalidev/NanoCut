// import { toggleTheme, handleApiError, formatDate, isValidUrl } from './utils.js';

// document.addEventListener('DOMContentLoaded', () => {
//     // Theme toggle
//     const themeToggle = document.getElementById('theme-toggle');
//     if (themeToggle) {
//         themeToggle.addEventListener('click', toggleTheme);
//     }

//     loadUrls();

//     // Logout button
//     const logoutBtn = document.getElementById('logout-btn');
//     if (logoutBtn) {
//         logoutBtn.addEventListener('click', async () => {
//             try {
//                 const response = await fetch('/api/auth/logout', {
//                     method: 'POST',
//                     credentials: 'include'
//                 });

//                 const data = await response.json();

//                 if (!response.ok) {
//                     throw new Error(data.error || 'Logout failed');
//                 }

//                 window.location.href = '/login';
//             } catch (err) {
//                 handleApiError(err);
//             }
//         });
//     }

//     // URL Shortener form
//     const urlForm = document.getElementById('url-form');
//     if (urlForm) {
//         urlForm.addEventListener('submit', async (e) => {
//             e.preventDefault();

//             const originalUrl = document.getElementById('original-url').value;
//             const customName = document.getElementById('custom-name').value;
//             const expiresIn = document.getElementById('expires-in').value;

//             if (!isValidUrl(originalUrl)) {
//                 handleApiError({ message: 'Please enter a valid URL' });
//                 return;
//             }

//             try {
//                 const response = await fetch('/api/urls', {
//                     method: 'POST',
//                     headers: {
//                         'Content-Type': 'application/json'
//                     },
//                     body: JSON.stringify({ originalUrl, customName, expiresIn }),
//                     credentials: 'include'
//                 });

//                 const data = await response.json();

//                 if (!response.ok) {
//                     throw new Error(data.error || 'Failed to create short URL');
//                 }

//                 // Reload URLs
//                 loadUrls();

//                 // Clear form
//                 urlForm.reset();

//                 // Show success message
//                 const alertElement = document.getElementById('alert');
//                 alertElement.textContent = 'URL shortened successfully!';
//                 alertElement.className = 'alert alert-success';
//                 alertElement.style.display = 'block';
//                 setTimeout(() => {
//                     alertElement.style.display = 'none';
//                 }, 3000);
//             } catch (err) {
//                 handleApiError(err);
//             }
//         });
//     }

//     // Load user's URLs
//     async function loadUrls() {
//         try {
//             const response = await fetch('/api/urls', {
//                 credentials: 'include'
//             });

//             const urls = await response.json();

//             if (!response.ok) {
//                 throw new Error(urls.error || 'Failed to load URLs');
//             }

//             renderUrls(urls);
//         } catch (err) {
//             handleApiError(err);
//         }
//     };

//     // Render URLs
//     const renderUrls = (urls) => {
//         const urlList = document.getElementById('url-list');
//         if (!urlList) return;

//         urlList.innerHTML = '';

//         if (urls.length === 0) {
//             urlList.innerHTML = '<p>No URLs found. Create your first short URL above!</p>';
//             return;
//         }

//         urls.forEach(url => {
//             const urlItem = document.createElement('li');
//             urlItem.className = 'url-item';

//             const isExpired = url.expiresAt && new Date(url.expiresAt) < new Date();
//             const statusClass = !url.isActive || isExpired ? 'inactive' : 'active';
//             const statusText = !url.isActive ? 'Inactive' : isExpired ? 'Expired' : 'Active';
//             const shortUrl = `${window.location.origin}/u/${url.shortId}`;

//             urlItem.innerHTML = `
//                 <div class="url-item-header">
//                     <a href="/u/${url.shortId}" target="_blank" class="url-short">${shortUrl}</a>
//                     <span class="url-status ${statusClass}">
//                         <i class="fas ${statusClass === 'active' ? 'fa-check-circle' : 'fa-times-circle'}"></i> ${statusText}
//                     </span>
//                 </div>
//                 <p class="url-original">
//                     <i class="fas fa-link"></i> ${url.originalUrl}
//                 </p>
//                 <div class="url-meta">
//                     <span><i class="fas fa-fingerprint"></i> ${url.shortId}</span>
//                     <span><i class="fas fa-chart-bar"></i> ${url.clicks} clicks</span>
//                     <span><i class="far fa-calendar-alt"></i> ${formatDate(url.createdAt)}</span>
//                     <span><i class="far fa-clock"></i> ${formatDate(url.expiresAt)}</span>
//                 </div>
//                 <div class="url-actions">
//                     <button class="btn btn-sm btn-copy" data-url="${shortUrl}" title="Copy to clipboard" aria-label="Copy URL">
//                         <i class="far fa-copy btn-icon"></i>
//                         <span class="btn-text">Copy</span>
//                     </button>

//                     <div class="toggle-container">
//                         <label class="toggle-switch">
//                             <input type="checkbox" ${url.isActive && !isExpired ? 'checked' : ''} data-id="${url.uid}" aria-label="Toggle URL active status">
//                             <span class="toggle-slider"></span>
//                         </label>
//                         <span class="toggle-label">${url.isActive && !isExpired ? 'Active' : 'Inactive'}</span>
//                     </div>

//                     <button class="btn btn-sm btn-danger" data-id="${url.uid}" aria-label="Delete URL">
//                         <i class="far fa-trash-alt btn-icon"></i>
//                         <span class="btn-text">Delete</span>
//                     </button>
//                 </div>
//             `;

//             // Safer copy function with fallback
//             const copyBtn = urlItem.querySelector('.btn-copy');
//             copyBtn.addEventListener('click', async () => {
//                 try {
//                     if (navigator.clipboard) {
//                         await navigator.clipboard.writeText(shortUrl);
//                     } else {
//                         // Fallback for browsers without Clipboard API
//                         const textarea = document.createElement('textarea');
//                         textarea.value = shortUrl;
//                         textarea.style.position = 'fixed';  // Prevent scrolling
//                         document.body.appendChild(textarea);
//                         textarea.select();
//                         document.execCommand('copy');
//                         document.body.removeChild(textarea);
//                     }

//                     // Visual feedback
//                     copyBtn.classList.add('copied');
//                     setTimeout(() => copyBtn.classList.remove('copied'), 2000);

//                 } catch (err) {
//                     console.error('Failed to copy:', err);
//                     // Fallback feedback
//                     const originalText = copyBtn.textContent;
//                     copyBtn.textContent = 'Press Ctrl+C';
//                     setTimeout(() => {
//                         copyBtn.textContent = originalText;
//                     }, 2000);
//                 }
//             });

//             urlList.appendChild(urlItem);
//         });

//         // Add event listeners for toggle switches
//         document.querySelectorAll('.toggle-switch input').forEach(toggle => {
//             toggle.addEventListener('change', async (e) => {
//                 const urlId = e.target.dataset.id;
//                 const isActive = e.target.checked;

//                 try {
//                     const response = await fetch(`/api/urls/${urlId}`, {
//                         method: 'PUT',
//                         headers: {
//                             'Content-Type': 'application/json'
//                         },
//                         body: JSON.stringify({ isActive }),
//                         credentials: 'include'
//                     });

//                     const data = await response.json();

//                     if (!response.ok) {
//                         throw new Error(data.error || 'Failed to update URL status');
//                     }

//                     // Reload URLs to reflect changes
//                     loadUrls();
//                 } catch (err) {
//                     handleApiError(err);
//                     // Revert the toggle if there was an error
//                     e.target.checked = !isActive;
//                 }
//             });
//         });

//         // Add event listeners for delete buttons
//         document.querySelectorAll('.btn-danger').forEach(btn => {
//             btn.addEventListener('click', async (e) => {
//                 const urlId = e.target.dataset.id;

//                 if (confirm('Are you sure you want to delete this URL?')) {
//                     try {
//                         const response = await fetch(`/api/urls/${urlId}`, {
//                             method: 'DELETE',
//                             credentials: 'include'
//                         });

//                         const data = await response.json();

//                         if (!response.ok) {
//                             throw new Error(data.error || 'Failed to delete URL');
//                         }

//                         // Reload URLs
//                         loadUrls();
//                     } catch (err) {
//                         handleApiError(err);
//                     }
//                 }
//             });
//         });
//     };
// });

import { toggleTheme, handleApiError, formatDate, isValidUrl } from './utils.js';
import { notify } from './notifier.js';

document.addEventListener('DOMContentLoaded', () => {
    // ====================== DOM ELEMENTS ======================
    const themeToggle = document.getElementById('theme-toggle');
    const logoutBtn = document.getElementById('logout-btn');
    const urlForm = document.getElementById('url-form');
    const urlList = document.getElementById('url-list');

    // ====================== EVENT LISTENERS ======================
    // Theme Toggle
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }

    // Logout Button
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }

    // URL Form Submission
    if (urlForm) {
        urlForm.addEventListener('submit', handleUrlSubmit);
    }

    // Initial Load
    loadUrls();

    // ====================== CORE FUNCTIONS ======================
    async function handleLogout() {
        try {
            const response = await fetch('/api/auth/logout', {
                method: 'POST',
                credentials: 'include'
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Logout failed');
            }

            window.location.href = '/login';
        } catch (err) {
            handleApiError(err);
        }
    }

    async function handleUrlSubmit(e) {
        e.preventDefault();

        const originalUrl = document.getElementById('original-url').value;
        const customName = document.getElementById('custom-name').value;
        const expiresIn = document.getElementById('expires-in').value;

        if (!isValidUrl(originalUrl)) {
            handleApiError({ message: 'Please enter a valid URL' });
            return;
        }

        try {
            const response = await fetch('/api/urls', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ originalUrl, customName, expiresIn }),
                credentials: 'include'
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to create short URL');
            }

            // Reset form and reload URLs
            urlForm.reset();
            loadUrls();

            // Show success message
            notify('URL shortened successfully', 'success')
        } catch (err) {
            handleApiError(err);
        }
    }

    async function loadUrls() {
        try {
            if (urlList) urlList.innerHTML = '<div class="loading">Loading URLs...</div>';

            const response = await fetch('/api/urls', {
                credentials: 'include'
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to load URLs');
            }

            const urls = await response.json();
            renderUrls(urls);
        } catch (err) {
            handleApiError(err);
            if (urlList) urlList.innerHTML = '<p class="error">Failed to load URLs. Please refresh.</p>';
        }
    }

    function renderUrls(urls) {
        if (!urlList) return;

        if (!urls || urls.length === 0) {
            urlList.innerHTML = '<p>No URLs found. Create your first short URL above!</p>';
            return;
        }

        urlList.innerHTML = '';
        urls.forEach(url => {
            const urlItem = createUrlItem(url);
            urlList.appendChild(urlItem);
        });

        attachUrlEventHandlers();
    }

    function getRemainingTime(target) {
        const t = new Date(target), now = new Date();
        if (t <= now) return "Time already passed.";

        let ms = t - now;
        const sec = 1000, min = 60 * sec, hr = 60 * min, day = 24 * hr, wk = 7 * day, mo = 30 * day, yr = 365 * day;

        const f = (v, l) => `${v} ${l}${v !== 1 ? 's' : ''}`;

        const y = Math.floor(ms / yr); if (y) return f(y, 'year');
        const m = Math.floor(ms / mo); if (m) return f(m, 'month');
        const w = Math.floor(ms / wk); if (w) return f(w, 'week');
        const d = Math.floor(ms / day); if (d) return f(d, 'day');
        const h = Math.floor(ms / hr); if (h) return f(h, 'hour');
        const mi = Math.floor(ms / min); if (mi) return f(mi, 'min');

        return "Less than a minute";
    }

    function createUrlItem(url) {
        const isExpired = url.expiresAt && new Date(url.expiresAt) < new Date();
        const statusClass = !url.isActive || isExpired ? 'inactive' : 'active';
        const statusText = !url.isActive ? 'Inactive' : isExpired ? 'Expired' : 'Active';
        const shortUrl = `${window.location.origin}/u/${url.shortId}`;

        const item = document.createElement('li');
        item.className = 'url-item';
        item.innerHTML = `
      <div class="url-item-header">
        <a href="/u/${url.shortId}" target="_blank" class="url-short">${shortUrl}</a>
        <span class="url-status ${statusClass}">
          <i class="fas ${statusClass === 'active' ? 'fa-check-circle' : 'fa-times-circle'}"></i> ${statusText}
        </span>
      </div>
      <p class="url-original">
        <i class="fas fa-link"></i> ${url.originalUrl}
      </p>
      <div class="url-meta">
        <span><i class="fas fa-fingerprint"></i> ${url.shortId}</span>
        <span><i class="fas fa-chart-bar"></i> ${url.clicks} clicks</span>
        <span><i class="far fa-calendar-alt"></i> ${formatDate(url.createdAt)}</span>
        <span><i class="far fa-clock"></i> ${url.expiresAt ? getRemainingTime(formatDate(url.expiresAt)) : 'Never'}</span>
      </div>
      <div class="url-actions">
        <button class="btn btn-sm btn-copy" data-url="${shortUrl}" title="Copy to clipboard">
          <i class="far fa-copy"></i> Copy
        </button>
        <div class="toggle-container">
          <label class="toggle-switch">
            <input type="checkbox" ${url.isActive && !isExpired ? 'checked' : ''} data-id="${url.uid}">
            <span class="toggle-slider"></span>
          </label>
          <span class="toggle-label">${url.isActive && !isExpired ? 'Active' : 'Inactive'}</span>
        </div>
        <button class="btn btn-sm btn-danger" data-id="${url.uid}">
          <i class="far fa-trash-alt"></i> Delete
        </button>
      </div>
    `;
        return item;
    }

    /**
 * Shows a confirmation modal dialog
 * @param {string} message - The message to display
 * @param {string} confirmText - Text for confirm button
 * @param {string} cancelText - Text for cancel button
 * @param {function} confirmFunc - Function to execute on confirmation
 */
    function showConfirm(message, confirmText = 'Confirm', cancelText = 'Cancel', confirmFunc) {
        // Create modal elements
        const modalOverlay = document.createElement('div');
        modalOverlay.className = 'confirm-modal-overlay';

        const modal = document.createElement('div');
        modal.className = 'confirm-modal';

        const messageEl = document.createElement('p');
        messageEl.className = 'confirm-message';
        messageEl.textContent = message;

        const buttonGroup = document.createElement('div');
        buttonGroup.className = 'confirm-button-group';

        const cancelBtn = document.createElement('button');
        cancelBtn.className = 'confirm-btn confirm-cancel';
        cancelBtn.textContent = cancelText;

        const confirmBtn = document.createElement('button');
        confirmBtn.className = 'confirm-btn confirm-primary';
        confirmBtn.textContent = confirmText;

        // Build modal structure
        buttonGroup.append(cancelBtn, confirmBtn);
        modal.append(messageEl, buttonGroup);
        modalOverlay.appendChild(modal);

        // Add to DOM
        document.body.appendChild(modalOverlay);

        // Event handlers
        const closeModal = () => {
            modalOverlay.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(modalOverlay);
            }, 200);
        };

        cancelBtn.addEventListener('click', closeModal);

        confirmBtn.addEventListener('click', () => {
            if (typeof confirmFunc === 'function') {
                confirmFunc();
            }
            closeModal();
        });

        // Close when clicking outside modal
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                closeModal();
            }
        });

        // Trigger fade-in animation
        setTimeout(() => {
            modalOverlay.style.opacity = '1';
        }, 10);
    }

    function attachUrlEventHandlers() {
        // Copy Buttons
        document.querySelectorAll('.btn-copy').forEach(btn => {
            btn.addEventListener('click', async () => {
                const url = btn.dataset.url;
                try {
                    await navigator.clipboard.writeText(url);
                    btn.innerHTML = '<i class="fas fa-check"></i> Copied!';
                    setTimeout(() => {
                        btn.innerHTML = '<i class="far fa-copy"></i> Copy';
                    }, 2000);
                } catch (err) {
                    console.error('Copy failed:', err);
                    btn.textContent = 'Press Ctrl+C to copy';
                    setTimeout(() => {
                        btn.innerHTML = '<i class="far fa-copy"></i> Copy';
                    }, 2000);
                }
            });
        });

        // Toggle Switches
        document.querySelectorAll('.toggle-switch input').forEach(toggle => {
            toggle.addEventListener('change', async (e) => {
                const urlId = e.target.dataset.id;
                const isActive = e.target.checked;

                try {
                    const response = await fetch(`/api/urls/${urlId}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ isActive }),
                        credentials: 'include'
                    });

                    if (!response.ok) {
                        const data = await response.json();
                        throw new Error(data.error || 'Failed to update URL status');
                    }

                    loadUrls(); // Refresh list
                } catch (err) {
                    handleApiError(err);
                    e.target.checked = !isActive; // Revert on error
                }
            });
        });

        // Delete Buttons
        document.querySelectorAll('.btn-danger').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                showConfirm('Are you sure you want to delete this URL', 'Delete', 'Cancel', async () => {
                    try {
                        const response = await fetch(`/api/urls/${e.target.dataset.id}`, {
                            method: 'DELETE',
                            credentials: 'include'
                        });

                        if (!response.ok) {
                            const data = await response.json();
                            throw new Error(data.error || 'Failed to delete URL');
                        }

                        loadUrls();
                    } catch (err) {
                        handleApiError(err);
                    }
                })
            });
        });
    }
});