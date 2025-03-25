document.addEventListener("DOMContentLoaded", function () {
  const username = "nitin27may"

  // Initialize back to top button
  initBackToTop()
  initNavigation()
  // Fetch GitHub profile data and repositories
  fetchUserProfile()
  fetchRepositories()

  // Smooth scrolling for navigation links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()

      const targetId = this.getAttribute("href")
      const targetElement = document.querySelector(targetId)

      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 60,
          behavior: "smooth",
        })
      }
    })
  })

  // Initialize back to top button functionality
  function initBackToTop() {
    const backToTopButton = document.getElementById("back-to-top")

    // Show/hide button based on scroll position
    window.addEventListener("scroll", function () {
      if (window.pageYOffset > 300) {
        backToTopButton.classList.add("visible")
      } else {
        backToTopButton.classList.remove("visible")
      }
    })

    // Scroll to top when clicked
    backToTopButton.addEventListener("click", function () {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      })
    })
  }

  // Fetch GitHub user profile data
  async function fetchUserProfile() {
    try {
      const response = await fetch(`https://api.github.com/users/${username}`)
      const profile = await response.json()

      const profileHeader = document.getElementById("profile-header")
      profileHeader.innerHTML = `
          <img src="${profile.avatar_url}" alt="${profile.name || username}" class="profile-image">
          <div class="profile-stats">
            <div class="stat-item" title="Location">
              <i class="fas fa-map-marker-alt"></i>
              <span>${profile.location || "Toronto, Canada"}</span>
            </div>
            <div class="stat-item" title="Followers">
              <i class="fas fa-users"></i>
              <span>${profile.followers} followers</span>
            </div>
            <div class="stat-item" title="GitHub">
              <i class="fab fa-github"></i>
              <span>@${username}</span>
            </div>
          </div>
        `
    } catch (error) {
      console.error("Error fetching user profile:", error)

      // Fallback profile data
      const profileHeader = document.getElementById("profile-header")
      profileHeader.innerHTML = `
          <img src="https://avatars.githubusercontent.com/u/8932780?v=4" alt="Nitin Singh" class="profile-image">
          <div class="profile-stats">
            <div class="stat-item" title="Location">
              <i class="fas fa-map-marker-alt"></i>
              <span>Toronto, Canada</span>
            </div>
            <div class="stat-item" title="GitHub">
              <i class="fab fa-github"></i>
              <span>@${username}</span>
            </div>
          </div>
        `
    }
  }

  // Fetch GitHub repositories
  async function fetchRepositories() {
    const selectedRepos = [
      "mean-docker",
      "clean-architecture-docker-dotnet-angular",
      "azure-storage-dotnet",
      "sharepoint-graph-api",
      "azure-blob-upload-nodejs",
      "SQLQueryOpenAI",
      "AzureOpenAi-Chat",
      "dotnet-cli",
      "azure-service-bus-dotnet"
    ]

    try {
      const response = await fetch(`https://api.github.com/users/${username}/repos`)
      let repositories = await response.json()

      if (selectedRepos && selectedRepos.length > 0) {
        // Create a map for quick lookup of repositories
        const repoMap = new Map(repositories.map((repo) => [repo.name.toLowerCase(), repo]))

        // First add repositories in the specified order
        repositories = selectedRepos.map((name) => repoMap.get(name.toLowerCase())).filter((repo) => repo !== undefined) // Remove any not found repos
      } else {
        // If no specific repos selected, sort by stars and forks
        repositories.sort((a, b) => {
          const starsCompare = b.stargazers_count - a.stargazers_count
          return starsCompare !== 0 ? starsCompare : b.forks_count - a.forks_count
        })
      }

      // Truncate to top 6 repositories
      repositories = repositories.slice(0, 9)

      const repoContainer = document.getElementById("repo-container")
      repoContainer.innerHTML = "" // Clear existing content

      if (repositories.length === 0) {
        repoContainer.innerHTML = `
            <div class="text-center">
              <p>No repositories found. Check out my <a href="https://github.com/${username}" target="_blank">GitHub profile</a> to see my work.</p>
            </div>
          `
        return
      }

      // Define descriptions for repositories that may not have them
      const repoDescriptions = {
        "mean-docker": "MEAN Stack implementation with Docker support, CI/CD pipeline with GitHub Actions, and comprehensive Docker Compose configurations.",
        "clean-architecture-docker-dotnet-angular":
          "Clean architecture implementation using .NET Core, Angular, and Docker. Demonstrates modern development practices for enterprise applications.",
        "azure-storage-dotnet": "Azure Storage integration with .NET Core, showcasing best practices for blob storage management and file processing.",
        "sharepoint-graph-api": "SharePoint Online integration using Graph API and .NET Core for document management system modernization.",
        "azure-blob-upload-nodejs": "High-performance file upload implementation using Azure Blob Storage and Node.js with chunked upload support.",
        "SQLQueryOpenAI": "Integration of OpenAI with SQL to enable natural language queries for database interactions.",
        "AzureOpenAi-Chat": "Implementation of chat functionality using Azure OpenAI services for intelligent conversational experiences.",
        "dotnet-cli": "Custom .NET CLI tools for streamlining development workflows and automation.",
        "azure-service-bus-dotnet": "Azure Service Bus implementation with .NET Core for reliable message processing and event-driven architectures.",
        
      }

      // Render repositories
      repositories.forEach((repo) => {
        const description = repo.description || repoDescriptions[repo.name] || "No description available"

        const card = document.createElement("div")
        card.className = "project-item"
        card.innerHTML = `
            <div class="project-content">
              <div class="project-title">
                <span>${repo.name}</span>
                <a href="${repo.html_url}" target="_blank" title="View Repository">
                  <i class="fas fa-external-link-alt"></i>
                </a>
              </div>
              <p class="project-description">${description}</p>
              <div class="project-meta">
                <span title="Stars">
                  <i class="fas fa-star"></i>${repo.stargazers_count}
                </span>
                <span title="Forks">
                  <i class="fas fa-code-branch"></i>${repo.forks_count}
                </span>
                <span title="Language">
                  <i class="fas fa-code"></i>${repo.language || "N/A"}
                </span>
              </div>
            </div>
          `
        repoContainer.appendChild(card)
      })

      // Add "View More" button if there are more repositories
      if (repositories.length > 0) {
        const viewMoreButton = document.createElement("div")
        viewMoreButton.className = "text-center"
        viewMoreButton.style.gridColumn = "1 / -1"
        viewMoreButton.style.marginTop = "2rem"
        viewMoreButton.innerHTML = `
            <a href="https://github.com/${username}?tab=repositories" target="_blank" class="btn-primary">
              View More Projects
            </a>
          `
        repoContainer.appendChild(viewMoreButton)
      }
    } catch (error) {
      console.error("Error fetching repositories:", error)
      const repoContainer = document.getElementById("repo-container")
      repoContainer.innerHTML = `
          <div class="text-center" style="grid-column: 1 / -1;">
            <p>Error loading repositories. Please try again later or visit my <a href="https://github.com/${username}" target="_blank">GitHub profile</a>.</p>
          </div>
        `
    }
  }

  // Add animation effect for sections on scroll
  const sections = document.querySelectorAll(".section")

  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.15,
  }

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1"
        entry.target.style.transform = "translateY(0)"
        observer.unobserve(entry.target)
      }
    })
  }, observerOptions)

  sections.forEach((section) => {
    section.style.opacity = "0"
    section.style.transform = "translateY(20px)"
    section.style.transition = "opacity 0.6s ease-out, transform 0.6s ease-out"
    observer.observe(section)
  })

  // Add animation for timeline items
  const timelineItems = document.querySelectorAll(".timeline-item")

  timelineItems.forEach((item, index) => {
    item.style.opacity = "0"
    item.style.transform = "translateX(-20px)"
    item.style.transition = `opacity 0.6s ease-out ${index * 0.2}s, transform 0.6s ease-out ${index * 0.2}s`

    setTimeout(() => {
      item.style.opacity = "1"
      item.style.transform = "translateX(0)"
    }, 300 + index * 200)
  })

  // Navigation functionality
  function initNavigation() {
    const nav = document.getElementById("sticky-nav")
    const navHeight = 60 // Approximate height of navbar
    const mobileToggle = document.querySelector(".mobile-menu-toggle")
    const navLinks = document.querySelector(".nav-links")
    const links = document.querySelectorAll(".nav-links a")

    // Show/hide navigation based on scroll position
    window.addEventListener("scroll", function () {
      if (window.scrollY > window.innerHeight * 0.7) {
        nav.classList.add("visible")
      } else {
        nav.classList.remove("visible")
      }

      // Highlight active section in nav
      let currentSection = ""
      document.querySelectorAll("section").forEach((section) => {
        const sectionTop = section.offsetTop
        if (window.scrollY >= sectionTop - navHeight - 10) {
          currentSection = section.getAttribute("id")
        }
      })

      links.forEach((link) => {
        link.classList.remove("active")
        if (link.getAttribute("href") === `#${currentSection}`) {
          link.classList.add("active")
        }
      })
    })

    // Mobile menu toggle
    mobileToggle.addEventListener("click", function () {
      navLinks.classList.toggle("open")
    })

    // Close mobile menu when clicking a link
    links.forEach((link) => {
      link.addEventListener("click", function () {
        navLinks.classList.remove("open")
      })
    })
  }

  // Update on window resize
  window.addEventListener("resize", function () {
    if (window.innerWidth <= 768) {
      initMobileNav()
      navButton.style.display = "flex"
    } else {
      navButton.style.display = "none"
    }
  })
})
