import { Component, OnInit, HostListener } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet, NavigationStart } from '@angular/router';
import { IssueService } from './service/issue.service';
import { trigger, transition, style, query, animate, group } from '@angular/animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    trigger('routeAnimations', [
      transition('* <=> *', [
        style({ position: 'relative' }),
        query(':enter, :leave', [
          style({
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            opacity: 0,
            transform: 'translateY(20px) scale(0.95)'
          })
        ], { optional: true }),
        query(':enter', [
          animate('0.5s ease-in-out', style({
            opacity: 1,
            transform: 'translateY(0) scale(1)'
          }))
        ], { optional: true }),
        query(':leave', [
          animate('0.3s ease-in-out', style({
            opacity: 0,
            transform: 'translateY(-10px) scale(0.98)'
          }))
        ], { optional: true })
      ])
    ])
  ]
})
export class AppComponent implements OnInit {
  title = 'Issue Tracker Pro';
  showScrollTop = false;
  lastUpdated = new Date();
  isAuthenticated = false;
  isNavigating = false;

  // Statistics
  totalIssues = 0;
  openIssues = 0;
  closedIssues = 0;

  constructor(private issueService: IssueService, private router: Router) {}

  ngOnInit() {
    // Check authentication status on app initialization
    this.checkAuthStatus();

    // Load statistics only if authenticated
    if (this.isAuthenticated) {
      this.loadStatistics();
    }

    // Listen to router events to update authentication status and navigation loading
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.checkAuthStatus();
        this.isNavigating = false; // Stop loading spinner when navigation completes
      }
    });

    // Show loading spinner during navigation
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.isNavigating = true;
      }
    });
  }

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.showScrollTop = window.pageYOffset > 300;
  }

  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  loadStatistics() {
    // Only load statistics if user is authenticated
    if (!this.isAuthenticated) {
      return;
    }

    this.issueService.getIssues().subscribe({
      next: (response: any) => {
        const issues = response.data || [];
        this.totalIssues = issues.length;
        this.openIssues = issues.filter((issue: any) => issue.status === 'Open').length;
        this.closedIssues = issues.filter((issue: any) => issue.status === 'Closed').length;
      },
      error: (error: any) => {
        console.error('Error loading statistics:', error);
        // Set default values if API fails
        this.totalIssues = 0;
        this.openIssues = 0;
        this.closedIssues = 0;
      }
    });
  }

  goToLandingPage() {
    // Redirect to auth page
    this.router.navigate(['/auth']);
  }

  isLandingPage(): boolean {
    return this.router.url === '/auth';
  }

  checkAuthStatus() {
    this.isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  }

  logout() {
    // Clear authentication data
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');

    this.isAuthenticated = false;

    // Navigate back to auth page
    this.router.navigate(['/auth']);
  }
}
