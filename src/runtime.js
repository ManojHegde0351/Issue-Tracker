// Runtime JavaScript for Issue Tracker Pro
// This file handles theme switching and interactive features

class IssueTrackerRuntime {
    constructor() {
        this.isDarkTheme = true;
        this.showScrollTop = false;
        this.init();
    }

    init() {
        // Initialize theme
        this.initializeTheme();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Initialize scroll detection
        this.initScrollDetection();
        
        console.log('Issue Tracker Pro Runtime initialized');
    }

    initializeTheme() {
        const savedTheme = localStorage.getItem('theme') || 'dark';
        this.isDarkTheme = savedTheme === 'dark';
        document.documentElement.setAttribute('data-theme', savedTheme);
        document.body.setAttribute('data-theme', savedTheme);
    }

    setupEventListeners() {
        // Theme toggle functionality
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('theme-toggle') || e.target.closest('.theme-toggle')) {
                this.toggleTheme();
            }
        });

        // Scroll to top functionality
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('scroll-to-top') || e.target.closest('.scroll-to-top')) {
                this.scrollToTop();
            }
        });

        // Navigation active state
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('nav-link')) {
                this.updateActiveNavLink(e.target);
            }
        });
    }

    toggleTheme() {
        this.isDarkTheme = !this.isDarkTheme;
        const theme = this.isDarkTheme ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', theme);
        document.body.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        
        // Add smooth transition effect
        document.body.style.transition = 'all 0.3s ease';
        setTimeout(() => {
            document.body.style.transition = '';
        }, 300);

        // Update theme toggle button text
        const themeToggle = document.querySelector('.theme-toggle');
        if (themeToggle) {
            themeToggle.innerHTML = this.isDarkTheme ? '☀️' : '🌙';
        }

        console.log(`Theme switched to: ${theme}`);
    }

    initScrollDetection() {
        window.addEventListener('scroll', () => {
            this.showScrollTop = window.pageYOffset > 300;
            const scrollBtn = document.querySelector('.scroll-to-top');
            if (scrollBtn) {
                scrollBtn.classList.toggle('visible', this.showScrollTop);
            }
        });
    }

    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    updateActiveNavLink(clickedLink) {
        // Remove active class from all nav links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        
        // Add active class to clicked link
        clickedLink.classList.add('active');
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
    window.issueTrackerRuntime = new IssueTrackerRuntime();
});

// Export for module usage
export { IssueTrackerRuntime };
