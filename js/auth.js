document.addEventListener('DOMContentLoaded', () => {
    const authModal = document.getElementById('authModal');
    const authButton = document.getElementById('authButton');
    const closeBtn = document.querySelector('.close');
    const authTabs = document.querySelectorAll('.auth-tab');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const contactForm = document.getElementById('contact-form');

    // Modal controls
    authButton.onclick = () => {
        authModal.style.display = 'block';
    }

    closeBtn.onclick = () => {
        authModal.style.display = 'none';
    }

    window.onclick = (event) => {
        if (event.target == authModal) {
            authModal.style.display = 'none';
        }
    }

    // Tab switching
    authTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.dataset.tab;
            
            // Update active tab
            authTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Show corresponding form
            document.querySelectorAll('.auth-form').forEach(form => {
                form.classList.remove('active');
            });
            document.getElementById(`${tabName}Form`).classList.add('active');
        });
    });

    // Login form submission
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(loginForm);
        formData.append('action', 'login');

        try {
            const response = await fetch('backend/auth.php', {
                method: 'POST',
                body: formData
            });
            const data = await response.json();
            
            if (data.success) {
                authModal.style.display = 'none';
                authButton.textContent = 'Logout';
                showNotification('Successfully logged in!', 'success');
            } else {
                showNotification(data.message || 'Login failed', 'error');
            }
        } catch (error) {
            showNotification('An error occurred', 'error');
        }
    });

    // Register form submission
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(registerForm);
        formData.append('action', 'register');

        try {
            const response = await fetch('backend/auth.php', {
                method: 'POST',
                body: formData
            });
            const data = await response.json();
            
            if (data.success) {
                showNotification('Registration successful! Please login.', 'success');
                // Switch to login tab
                document.querySelector('[data-tab="login"]').click();
            } else {
                showNotification(data.message || 'Registration failed', 'error');
            }
        } catch (error) {
            showNotification('An error occurred', 'error');
        }
    });

    // Contact form submission
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(contactForm);
        formData.append('action', 'contact');

        try {
            const response = await fetch('backend/auth.php', {
                method: 'POST',
                body: formData
            });
            const data = await response.json();
            
            if (data.success) {
                showNotification('Message sent successfully!', 'success');
                contactForm.reset();
            } else {
                showNotification(data.message || 'Failed to send message', 'error');
            }
        } catch (error) {
            showNotification('An error occurred', 'error');
        }
    });

    // Notification system
    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
});
