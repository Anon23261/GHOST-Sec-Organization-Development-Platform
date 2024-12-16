// Demo data
const courses = [
    { id: 1, title: 'Linux System Administration', progress: 75, modules: 12, enrolled: '2024-01-15', instructor: 'John Smith' },
    { id: 2, title: 'Network Security Fundamentals', progress: 45, modules: 8, enrolled: '2024-02-01', instructor: 'Sarah Johnson' },
    { id: 3, title: 'Cloud Computing with AWS', progress: 90, modules: 10, enrolled: '2024-01-20', instructor: 'Mike Wilson' },
    { id: 4, title: 'DevOps Practices', progress: 60, modules: 15, enrolled: '2024-02-10', instructor: 'Emily Brown' }
];

const achievements = [
    { id: 1, title: 'Fast Learner', description: 'Completed 5 modules in one day', icon: 'fa-bolt' },
    { id: 2, title: 'Perfect Score', description: 'Scored 100% in an assessment', icon: 'fa-star' },
    { id: 3, title: 'Consistent', description: 'Logged in for 7 days straight', icon: 'fa-calendar-check' }
];

// Initialize the dashboard
document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
    setupEventListeners();
    startRealtimeUpdates();
});

function initializeDashboard() {
    updateCourseProgress();
    loadAchievements();
    updateStats();
    initializeCharts();
}

function updateCourseProgress() {
    const courseList = document.querySelector('.course-list');
    if (!courseList) return;

    courseList.innerHTML = courses.map(course => `
        <div class="card course-card" data-course-id="${course.id}">
            <div class="course-header">
                <h3>${course.title}</h3>
                <span class="instructor"><i class="fas fa-user"></i> ${course.instructor}</span>
            </div>
            <div class="progress-container">
                <div class="progress-bar" style="width: ${course.progress}%"></div>
            </div>
            <div class="course-info">
                <span><i class="fas fa-book"></i> ${course.modules} Modules</span>
                <span><i class="fas fa-calendar"></i> Enrolled: ${course.enrolled}</span>
                <span><i class="fas fa-chart-line"></i> Progress: ${course.progress}%</span>
            </div>
            <div class="course-actions">
                <button class="btn" onclick="continueCourse(${course.id})">
                    <i class="fas fa-play"></i> Continue
                </button>
                <button class="btn secondary" onclick="viewDetails(${course.id})">
                    <i class="fas fa-info-circle"></i> Details
                </button>
            </div>
        </div>
    `).join('');
}

function loadAchievements() {
    const achievementList = document.querySelector('.achievements-list');
    if (!achievementList) return;

    achievementList.innerHTML = achievements.map(achievement => `
        <div class="achievement-card" data-achievement-id="${achievement.id}">
            <div class="achievement-icon">
                <i class="fas ${achievement.icon}"></i>
            </div>
            <div class="achievement-info">
                <h4>${achievement.title}</h4>
                <p>${achievement.description}</p>
            </div>
        </div>
    `).join('');
}

function updateStats() {
    const stats = {
        coursesCompleted: 5,
        hoursSpent: 48,
        certificatesEarned: 3,
        currentStreak: 7
    };

    Object.entries(stats).forEach(([key, value]) => {
        const element = document.querySelector(`[data-stat="${key}"]`);
        if (element) {
            element.textContent = value;
        }
    });
}

function initializeCharts() {
    const ctx = document.getElementById('learningProgress');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
            datasets: [{
                label: 'Learning Hours',
                data: [8, 15, 12, 13],
                borderColor: '#00ff00',
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Learning Progress'
                }
            }
        }
    });
}

function setupEventListeners() {
    // Course search
    const searchInput = document.querySelector('.course-search');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(function() {
            filterCourses(this.value);
        }, 300));
    }

    // Sort courses
    const sortSelect = document.querySelector('.sort-courses');
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            sortCourses(this.value);
        });
    }
}

function filterCourses(searchTerm) {
    const filteredCourses = courses.filter(course => 
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.instructor.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    const courseList = document.querySelector('.course-list');
    if (!courseList) return;

    if (filteredCourses.length === 0) {
        courseList.innerHTML = '<div class="no-results">No courses found matching your search.</div>';
    } else {
        updateCourseProgress();
    }
}

function sortCourses(criteria) {
    const sortedCourses = [...courses];
    switch (criteria) {
        case 'progress':
            sortedCourses.sort((a, b) => b.progress - a.progress);
            break;
        case 'title':
            sortedCourses.sort((a, b) => a.title.localeCompare(b.title));
            break;
        case 'date':
            sortedCourses.sort((a, b) => new Date(b.enrolled) - new Date(a.enrolled));
            break;
    }
    courses.splice(0, courses.length, ...sortedCourses);
    updateCourseProgress();
}

function continueCourse(courseId) {
    const course = courses.find(c => c.id === courseId);
    if (!course) return;

    showNotification(`Continuing ${course.title}...`, 'success');
    // Simulate course loading
    setTimeout(() => {
        window.location.href = `#course-${courseId}`;
    }, 500);
}

function viewDetails(courseId) {
    const course = courses.find(c => c.id === courseId);
    if (!course) return;

    const modal = document.createElement('div');
    modal.className = 'modal fade-in';
    modal.innerHTML = `
        <div class="modal-content slide-in">
            <div class="modal-header">
                <h2>${course.title}</h2>
                <button onclick="this.closest('.modal').remove()">×</button>
            </div>
            <div class="modal-body">
                <p><strong>Instructor:</strong> ${course.instructor}</p>
                <p><strong>Progress:</strong> ${course.progress}%</p>
                <p><strong>Modules:</strong> ${course.modules}</p>
                <p><strong>Enrolled:</strong> ${course.enrolled}</p>
                <div class="course-syllabus">
                    <h3>Syllabus</h3>
                    <ul>
                        ${Array(course.modules).fill(0).map((_, i) => 
                            `<li>Module ${i + 1}: ${generateModuleTitle(course.title, i + 1)}</li>`
                        ).join('')}
                    </ul>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function startRealtimeUpdates() {
    // Simulate real-time updates
    setInterval(() => {
        const randomCourse = courses[Math.floor(Math.random() * courses.length)];
        if (Math.random() > 0.7) { // 30% chance of progress update
            randomCourse.progress = Math.min(100, randomCourse.progress + 1);
            updateCourseProgress();
        }
    }, 5000);
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type} slide-in`;
    notification.innerHTML = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('show');
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }, 100);
}

function generateModuleTitle(courseTitle, moduleNumber) {
    const topics = {
        'Linux System Administration': [
            'System Overview', 'User Management', 'File Systems',
            'Process Management', 'Network Configuration', 'Security',
            'Package Management', 'Shell Scripting', 'System Monitoring',
            'Backup and Recovery', 'Performance Tuning', 'Troubleshooting'
        ],
        'Network Security Fundamentals': [
            'Security Basics', 'Cryptography', 'Network Protocols',
            'Threat Analysis', 'Firewall Configuration', 'IDS/IPS',
            'VPN Setup', 'Security Policies'
        ],
        'Cloud Computing with AWS': [
            'AWS Overview', 'EC2 Instances', 'S3 Storage',
            'IAM', 'VPC', 'Lambda Functions',
            'CloudFormation', 'CloudWatch', 'Route 53',
            'ELB'
        ],
        'DevOps Practices': [
            'DevOps Introduction', 'Git Workflow', 'CI/CD',
            'Docker', 'Kubernetes', 'Infrastructure as Code',
            'Monitoring', 'Log Management', 'Automation',
            'Testing Strategies', 'Deployment Patterns', 'Scaling',
            'Security Integration', 'Performance Optimization', 'Documentation'
        ]
    };

    const defaultTopics = [
        'Introduction', 'Fundamentals', 'Advanced Concepts',
        'Best Practices', 'Case Studies', 'Practical Applications'
    ];

    const courseTopics = topics[courseTitle] || defaultTopics;
    return courseTopics[moduleNumber - 1] || `Topic ${moduleNumber}`;
}

// Utility function for debouncing
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func.apply(this, args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
