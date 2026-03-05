// Main JavaScript for Issue Tracker Pro
// This file handles the main application logic and UI interactions

class IssueTrackerApp {
    constructor() {
        this.issues = [
            {
                id: '1',
                title: 'Fix login authentication bug',
                description: 'Users are unable to login with special characters in their passwords. This affects approximately 15% of our user base.',
                status: 'Open',
                priority: 'High',
                assignee: 'john.doe@example.com',
                created_at: new Date().toISOString(),
                comments: [
                    'User1: This is affecting multiple users, needs immediate attention.',
                    'User2: I can reproduce this issue consistently.'
                ]
            },
            {
                id: '2',
                title: 'Implement dark mode toggle functionality',
                description: 'Add a theme switching system that allows users to toggle between light and dark modes with persistence.',
                status: 'In Progress',
                priority: 'Medium',
                assignee: 'jane.smith@example.com',
                created_at: new Date().toISOString(),
                comments: [
                    'Developer: Working on the CSS variables system.',
                    'Designer: UI mockups are ready for review.'
                ]
            },
            {
                id: '3',
                title: 'Update API documentation',
                description: 'The current API documentation is outdated and missing several new endpoints that were added in v2.0.',
                status: 'Open',
                priority: 'Low',
                assignee: 'bob.wilson@example.com',
                created_at: new Date().toISOString(),
                comments: [
                    'Tech Writer: Starting documentation review this week.',
                    'PM: This should be completed before next release.'
                ]
            }
        ];
        this.currentView = 'home';
        this.selectedIssue = this.issues[0];
        this.apiBaseUrl = 'http://localhost:5000/api';
        this.init();
    }

    init() {
        this.setupUI();
        this.loadIssues();
        this.setupEventHandlers();
        this.updateDisplay();
        
        // Set initial view to Home
        this.navigate('Home');
        
        console.log('Issue Tracker Pro Main App initialized');
    }

    setupUI() {
        // Add theme toggle button to navigation
        this.addThemeToggle();
        
        // Add floating action button
        this.addFloatingActionButton();
        
        // Add scroll to top button
        this.addScrollToTopButton();
    }

    addThemeToggle() {
        const navMenu = document.querySelector('.nav-menu');
        if (navMenu && !document.querySelector('.theme-toggle')) {
            const themeToggleItem = document.createElement('li');
            themeToggleItem.className = 'nav-item';
            themeToggleItem.innerHTML = `
                <button class="theme-toggle" title="Toggle Theme">
                    <span>🌙</span>
                </button>
            `;
            navMenu.appendChild(themeToggleItem);
        }
    }

    addFloatingActionButton() {
        if (!document.querySelector('.fab')) {
            const fab = document.createElement('button');
            fab.className = 'fab';
            fab.title = 'Create New Issue';
            fab.innerHTML = '➕';
            fab.addEventListener('click', () => this.showCreateIssueForm());
            document.body.appendChild(fab);
        }
    }

    addScrollToTopButton() {
        if (!document.querySelector('.scroll-to-top')) {
            const scrollBtn = document.createElement('button');
            scrollBtn.className = 'scroll-to-top';
            scrollBtn.title = 'Scroll to Top';
            scrollBtn.innerHTML = '↑';
            document.body.appendChild(scrollBtn);
        }
    }

    setupEventHandlers() {
        // Navigation handling
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('nav-link')) {
                e.preventDefault();
                const text = e.target.textContent.trim();
                this.navigate(text);
            }
        });

        // Issue item click handling
        document.addEventListener('click', (e) => {
            if (e.target.closest('.issue-item')) {
                const issueItem = e.target.closest('.issue-item');
                const issueTitle = issueItem.querySelector('.issue-title').textContent;
                const issue = this.issues.find(i => i.title === issueTitle);
                if (issue) {
                    this.selectedIssue = issue;
                    this.updateIssueDetail();
                }
            }
        });

        // Form submission handling - Use event delegation since form exists in HTML
        document.addEventListener('submit', (e) => {
            if (e.target.classList.contains('issue-form')) {
                e.preventDefault();
                this.handleCreateIssue(e);
            }
        });

        // Footer links handling
        document.addEventListener('click', (e) => {
            if (e.target.closest('.footer-links a')) {
                e.preventDefault();
                const text = e.target.textContent.trim();
                // Remove emoji and get clean text
                const cleanText = text.replace(/🏠|📋|➕/g, '').trim();
                this.navigate(cleanText);
            }
        });
    }

    navigate(route) {
        // Update active nav link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        
        const activeLink = Array.from(document.querySelectorAll('.nav-link'))
            .find(link => link.textContent.trim() === route);
        if (activeLink) {
            activeLink.classList.add('active');
        }

        // Show/hide sections based on navigation
        switch(route) {
            case 'Home':
                this.showSection('welcome-section');
                this.hideSection('issue-list-container');
                this.hideSection('issue-detail-container');
                this.hideSection('issue-form-container');
                break;
            case 'Issues':
                this.hideSection('welcome-section');
                this.showSection('issue-list-container');
                this.showSection('issue-detail-container');
                this.hideSection('issue-form-container');
                // Update the issues list when navigating to Issues
                this.updateIssuesList();
                break;
            case 'Create Issue':
                this.hideSection('welcome-section');
                this.hideSection('issue-list-container');
                this.hideSection('issue-detail-container');
                this.showSection('issue-form-container');
                break;
            case 'Profile':
                this.showNotification('Profile section coming soon!', 'info');
                // Don't change sections for Profile, just show notification
                break;
            default:
                this.showSection('welcome-section');
                this.hideSection('issue-list-container');
                this.hideSection('issue-detail-container');
                this.hideSection('issue-form-container');
        }
    }

    showSection(className) {
        const section = document.querySelector(`.${className}`);
        if (section) {
            section.style.display = 'block';
        }
    }

    hideSection(className) {
        const section = document.querySelector(`.${className}`);
        if (section) {
            section.style.display = 'none';
        }
    }

    async loadIssues() {
        try {
            const response = await fetch(`${this.apiBaseUrl}/issues`);
            if (response.ok) {
                const data = await response.json();
                this.issues = [...this.issues, ...data.data] || this.issues;
            }
        } catch (error) {
            console.log('API not available, using local data');
        }
        this.updateDisplay();
    }

    updateDisplay() {
        this.updateIssuesList();
        this.updateIssueDetail();
    }

    updateIssuesList() {
        const issueList = document.querySelector('.issue-list');
        if (!issueList) return;

        issueList.innerHTML = this.issues.map(issue => `
            <li class="issue-item" data-issue-id="${issue.id}">
                <h3 class="issue-title">${issue.title}</h3>
                <p class="issue-description">${issue.description}</p>
                <span class="status-badge status-${issue.status.toLowerCase().replace(' ', '-')}">${issue.status}</span>
            </li>
        `).join('');
    }

    updateIssueDetail() {
        const detailCard = document.querySelector('.issue-detail-card');
        if (!detailCard || !this.selectedIssue) return;

        detailCard.innerHTML = `
            <h3>${this.selectedIssue.title}</h3>
            <p>${this.selectedIssue.description}</p>
            <div class="issue-meta">
                <span class="status-badge status-${this.selectedIssue.status.toLowerCase().replace(' ', '-')}">${this.selectedIssue.status}</span>
                <span class="priority-badge priority-${this.selectedIssue.priority.toLowerCase()}">${this.selectedIssue.priority}</span>
                <span class="assignee">Assigned to: ${this.selectedIssue.assignee}</span>
            </div>
            <ul class="issue-comments">
                ${this.selectedIssue.comments.map(comment => `<li>${comment}</li>`).join('')}
            </ul>
        `;
    }

    handleCreateIssue(event) {
        event.preventDefault();
        const form = event.target;
        
        // Get form values using the actual input names from HTML
        const title = form.querySelector('#title').value;
        const description = form.querySelector('#description').value;
        const priority = form.querySelector('#priority').value;
        
        const newIssue = {
            id: Date.now().toString(),
            title: title,
            description: description,
            status: 'Open',
            priority: priority.charAt(0).toUpperCase() + priority.slice(1), // Capitalize first letter
            assignee: 'new.user@example.com',
            created_at: new Date().toISOString(),
            comments: ['Issue created via web form.']
        };

        this.issues.unshift(newIssue);
        this.selectedIssue = newIssue;
        this.updateDisplay();
        
        // Clear form
        form.reset();
        
        this.showNotification('Issue created successfully!', 'success');
        
        // Navigate to Issues view to show the new issue
        this.navigate('Issues');
    }

    // Utility function to show notifications
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}</span>
                <span class="notification-message">${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.issueTrackerApp = new IssueTrackerApp();
});

// Export for module usage
export { IssueTrackerApp };
