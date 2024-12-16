document.addEventListener('DOMContentLoaded', function() {
    // GitHub repositories to fetch stats for
    const repos = [
        'Anon23261/Official-ghostC-OS',
        'Anon23261/FirstBootloaderBuild',
        'Anon23261/GHOSTc-OS'
    ];

    // Fetch GitHub stats for each repository
    repos.forEach(fetchGitHubStats);
});

async function fetchGitHubStats(repo) {
    try {
        const response = await fetch(`https://api.github.com/repos/${repo}`, {
            headers: {
                'Accept': 'application/vnd.github.v3+json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        updateRepoStats(repo, data);
    } catch (error) {
        console.log(`Error fetching stats for ${repo}:`, error);
        // Handle the error gracefully - update UI to show error state
        const repoElement = document.querySelector(`[data-repo="${repo}"]`);
        if (repoElement) {
            const statsElement = repoElement.querySelector('.repo-stats');
            if (statsElement) {
                statsElement.innerHTML = '<span class="error">Stats temporarily unavailable</span>';
            }
        }
    }
}

function updateRepoStats(repo, data) {
    const repoElement = document.querySelector(`[data-repo="${repo}"]`);
    if (repoElement) {
        const statsElement = repoElement.querySelector('.repo-stats');
        if (statsElement) {
            statsElement.innerHTML = `
                <span>⭐ ${data.stargazers_count}</span>
                <span>🔄 ${data.forks_count}</span>
                <span>👁️ ${data.watchers_count}</span>
            `;
        }
    }
}
