document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // GitHub stats fetcher
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
                
                // Update stats in the corresponding project card
                const repoName = repo.split('/')[1];
                const card = document.querySelector(`.project-card h3:contains('${repoName}')`).closest('.project-card');
                if (card) {
                    card.querySelector('.github-stats').innerHTML = `
                        <span><i class="fas fa-star"></i> ${data.stargazers_count}</span>
                        <span><i class="fas fa-code-branch"></i> ${data.forks_count}</span>
                    `;
                }
            } catch (error) {
                console.error(`Error fetching stats for ${repo}:`, error);
            }
        }
    }

    // Fetch GitHub stats on page load
    fetchGitHubStats();

    // Add animation to project cards on scroll
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.project-card').forEach(card => {
        observer.observe(card);
    });

    // Dynamic navigation background
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
});
