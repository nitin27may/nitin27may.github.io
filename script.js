document.addEventListener("DOMContentLoaded", function () {
    const username = "nitin27may";

    async function fetchUserProfile() {
        try {
            const response = await fetch(`https://api.github.com/users/${username}`);
            const profile = await response.json();
            
            const profileHeader = document.querySelector('.profile-header');
            profileHeader.innerHTML = `
                <img src="${profile.avatar_url}" alt="${profile.name}" class="profile-image">
                <h2 class="profile-name">${profile.name}</h2>
                <p class="profile-bio">${profile.bio || 'Full Stack Software Engineer'}</p>
                <div class="profile-stats">
                    <div class="stat-item" title="Location">
                        <i class="material-icons">location_on</i>
                        <span>${profile.location || 'Earth'}</span>
                    </div>
                    <div class="stat-item" title="Followers">
                        <i class="material-icons">people</i>
                        <span>${profile.followers} followers</span>
                    </div>
                </div>
            `;
        } catch (error) {
            console.error('Error fetching user profile:', error);
        }
    }

    const selectedRepos = [
        "mean-docker",
        "clean-architecture-docker-dotnet-angular",
        "azure-storage-dotnet",
        "sharepoint-graph-api",
        "azure-blob-upload-nodejs",
        "SQLQueryOpenAI",
        "AzureOpenAi-Chat",
        "dotnet-cli",
        "azure-service-bus-dotnet",
        "powershell-examples",
   
    ];

    async function fetchRepositories() {
        try {
            const response = await fetch(`https://api.github.com/users/${username}/repos`);
            let repositories = await response.json();
            
            if (selectedRepos && selectedRepos.length > 0) {
                // Create a map for quick lookup of repositories
                const repoMap = new Map(repositories.map(repo => [repo.name.toLowerCase(), repo]));
                
                // First add repositories in the specified order
                repositories = selectedRepos
                    .map(name => repoMap.get(name.toLowerCase()))
                    .filter(repo => repo !== undefined); // Remove any not found repos
            } else {
                // If no specific repos selected, sort by stars and forks
                repositories.sort((a, b) => {
                    const starsCompare = b.stargazers_count - a.stargazers_count;
                    return starsCompare !== 0 ? starsCompare : b.forks_count - a.forks_count;
                });
            }

            const repoContainer = document.getElementById('repo-container');
            repoContainer.innerHTML = ''; // Clear existing content
            
            if (repositories.length === 0) {
                repoContainer.innerHTML = `
                    <div class="col s12">
                        <div class="card">
                            <div class="card-content center-align">
                                <p>No repositories found.</p>
                            </div>
                        </div>
                    </div>
                `;
                return;
            }

            // Render repositories
            repositories.forEach(repo => {
                const card = document.createElement('div');
                card.className = 'col s12 m6 l4';
                card.innerHTML = `
                    <div class="card">
                        <div class="card-content">
                            <div class="card-header">
                                <span class="card-title truncate">${repo.name}</span>
                                <a href="${repo.html_url}" class="repo-link" target="_blank" title="View Repository">
                                    <i class="material-icons tiny">open_in_new</i>
                                </a>
                            </div>
                            <p class="description">${repo.description || 'No description available'}</p>
                            <div class="repo-details">
                                <p title="Stars">
                                    <i class="material-icons tiny">star_border</i>${repo.stargazers_count}
                                </p>
                                <p title="Forks">
                                    <i class="material-icons tiny">call_split</i>${repo.forks_count}
                                </p>
                                <p title="Language">
                                    <i class="material-icons tiny">code</i>${repo.language || 'N/A'}
                                </p>
                            </div>
                        </div>
                    </div>
                `;
                repoContainer.appendChild(card);
            });
        } catch (error) {
            console.error('Error fetching repositories:', error);
            const repoContainer = document.getElementById('repo-container');
            repoContainer.innerHTML = `
                <div class="col s12">
                    <div class="card">
                        <div class="card-content center-align">
                            <p>Error loading repositories. Please try again later.</p>
                        </div>
                    </div>
                </div>
            `;
        }
    }

    fetchUserProfile();
    fetchRepositories();
});