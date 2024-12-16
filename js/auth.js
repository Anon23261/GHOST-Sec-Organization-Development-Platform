document.addEventListener('DOMContentLoaded', function() {
    // Login form handling
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            try {
                const response = await fetch('api/auth.json');
                const data = await response.json();
                if (data.status === 'success') {
                    showNotification('Login successful!', 'success');
                    // Simulate logged in state
                    localStorage.setItem('isLoggedIn', 'true');
                    updateUIForLoggedInUser();
                }
            } catch (error) {
                showNotification('Error during login. Please try again.', 'error');
            }
        });
    }

    // Registration form handling
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            try {
                const response = await fetch('api/auth.json');
                const data = await response.json();
                if (data.status === 'success') {
                    showNotification('Registration successful! Please login.', 'success');
                }
            } catch (error) {
                showNotification('Error during registration. Please try again.', 'error');
            }
        });
    }

    // Contact form handling
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            try {
                const response = await fetch('api/contact.json');
                const data = await response.json();
                if (data.status === 'success') {
                    showNotification('Message sent successfully!', 'success');
                    contactForm.reset();
                }
            } catch (error) {
                showNotification('Error sending message. Please try again.', 'error');
            }
        });
    }

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

    // UI update for logged in user
    function updateUIForLoggedInUser() {
        const authButtons = document.querySelectorAll('.auth-button');
        authButtons.forEach(button => {
            if (button.classList.contains('login')) {
                button.style.display = 'none';
            } else if (button.classList.contains('logout')) {
                button.style.display = 'block';
            }
        });
    }

    // Check login status on page load
    if (localStorage.getItem('isLoggedIn') === 'true') {
        updateUIForLoggedInUser();
    }
});
