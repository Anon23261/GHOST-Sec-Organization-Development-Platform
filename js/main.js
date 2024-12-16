document.addEventListener('DOMContentLoaded', () => {
    // Initialize UI components
    initializeUI();
    
    // Initialize authentication
    initializeAuth();
    
    // Initialize GitHub stats
    fetchGitHubStats();
    
    // Initialize animations
    initializeAnimations();
});

// UI Initialization
function initializeUI() {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
    }

    // Modal functionality
    initializeModals();
}

// Authentication Initialization
function initializeAuth() {
    const loginBtn = document.querySelector('.login-btn');
    const registerBtn = document.querySelector('.register-btn');
    const logoutBtn = document.querySelector('.logout-btn');
    const authModal = document.getElementById('authModal');

    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            showModal('authModal');
            setActiveTab('login');
        });
    }

    if (registerBtn) {
        registerBtn.addEventListener('click', () => {
            showModal('authModal');
            setActiveTab('register');
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }

    // Check authentication status
    checkAuthStatus();
}

// GitHub Stats
async function fetchGitHubStats() {
    const repos = [
        'Anon23261/Official-ghostC-OS',
        'Anon23261/FirstBootloaderBuild',
        'Anon23261/GHOSTc-OS'
    ];

    for (const repo of repos) {
        try {
            const response = await fetch(`https://api.github.com/repos/${repo}`);
            const data = await response.json();
            
            const repoName = repo.split('/')[1];
            updateRepoStats(repoName, data);
        } catch (error) {
            console.error(`Error fetching stats for ${repo}:`, error);
        }
    }
}

// Animation Initialization
function initializeAnimations() {
    // Project cards animation
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.project-card, .resource-card').forEach(card => {
        observer.observe(card);
    });

    // Add hover effects
    document.querySelectorAll('.btn, .nav-links a').forEach(element => {
        element.addEventListener('mouseenter', addHoverEffect);
        element.addEventListener('mouseleave', removeHoverEffect);
    });
}

// Helper Functions
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

function setActiveTab(tabName) {
    document.querySelectorAll('.auth-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.tab === tabName);
    });
    document.querySelectorAll('.auth-form').forEach(form => {
        form.classList.toggle('active', form.id === `${tabName}Form`);
    });
}

function updateRepoStats(repoName, data) {
    const card = document.querySelector(`.project-card h3:contains('${repoName}')`);
    if (card) {
        const statsContainer = card.closest('.project-card').querySelector('.github-stats');
        if (statsContainer) {
            statsContainer.innerHTML = `
                <span><i class="fas fa-star"></i> ${data.stargazers_count}</span>
                <span><i class="fas fa-code-branch"></i> ${data.forks_count}</span>
            `;
        }
    }
}

function handleLogout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userToken');
    updateAuthUI(false);
    showNotification('Successfully logged out!', 'success');
}

function checkAuthStatus() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    updateAuthUI(isLoggedIn);
}

function updateAuthUI(isLoggedIn) {
    const loginBtn = document.querySelector('.login-btn');
    const registerBtn = document.querySelector('.register-btn');
    const logoutBtn = document.querySelector('.logout-btn');
    const userMenu = document.querySelector('.user-menu');

    if (loginBtn) loginBtn.style.display = isLoggedIn ? 'none' : 'block';
    if (registerBtn) registerBtn.style.display = isLoggedIn ? 'none' : 'block';
    if (logoutBtn) logoutBtn.style.display = isLoggedIn ? 'block' : 'none';
    if (userMenu) userMenu.style.display = isLoggedIn ? 'block' : 'none';
}

function addHoverEffect(e) {
    const element = e.target;
    element.style.transform = 'scale(1.05)';
    element.style.transition = 'transform 0.3s ease';
}

function removeHoverEffect(e) {
    const element = e.target;
    element.style.transform = 'scale(1)';
}

function initializeModals() {
    // Modal functionality implementation
}

function showNotification(message, type) {
    // Notification implementation
}
