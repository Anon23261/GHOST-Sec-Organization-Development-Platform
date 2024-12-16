document.addEventListener('DOMContentLoaded', function() {
    // Initialize tooltips
    const tooltips = document.querySelectorAll('[data-tooltip]');
    tooltips.forEach(tooltip => {
        new bootstrap.Tooltip(tooltip);
    });

    // Course progress tracking
    const progressBars = document.querySelectorAll('.progress-bar');
    progressBars.forEach(bar => {
        const progress = parseInt(bar.getAttribute('data-progress'));
        bar.style.width = `${progress}%`;
    });

    // Video player functionality
    const videoPlayers = document.querySelectorAll('.video-player');
    videoPlayers.forEach(player => {
        player.addEventListener('click', function() {
            const videoId = this.getAttribute('data-video-id');
            // Simulate video loading
            this.innerHTML = `<div class="video-placeholder">Video ${videoId} Loading...</div>`;
        });
    });

    // Course search functionality
    const searchInput = document.querySelector('.course-search');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const courses = document.querySelectorAll('.course-card');
            
            courses.forEach(course => {
                const title = course.querySelector('h3').textContent.toLowerCase();
                const description = course.querySelector('p').textContent.toLowerCase();
                
                if (title.includes(searchTerm) || description.includes(searchTerm)) {
                    course.style.display = 'block';
                } else {
                    course.style.display = 'none';
                }
            });
        });
    }

    // Course enrollment simulation
    const enrollButtons = document.querySelectorAll('.enroll-button');
    enrollButtons.forEach(button => {
        button.addEventListener('click', function() {
            const courseId = this.getAttribute('data-course-id');
            this.textContent = 'Enrolled';
            this.disabled = true;
            this.classList.add('enrolled');
            
            showNotification(`Successfully enrolled in course ${courseId}!`);
        });
    });

    // Notification system
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
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

    // Code preview syntax highlighting
    if (window.Prism) {
        Prism.highlightAll();
    }
});
