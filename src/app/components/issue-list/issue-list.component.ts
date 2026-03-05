import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IssueService } from '../../service/issue.service';
import { Issue, IssueFilters } from '../../models/issue-models';

@Component({
  selector: 'app-issue-list',
  templateUrl: './issue-list.component.html',
  styleUrls: ['./issue-list.component.css']
})
export class IssueListComponent implements OnInit {
  issues: Issue[] = [];
  loading = false;
  error: string | null = null;

  // Filter and pagination state
  filters: IssueFilters = {
    page: 1,
    pageSize: 10,
    sortBy: 'updatedAt',
    sortOrder: 'desc'
  };

  pagination = {
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0
  };

  // Filter options
  statusOptions = ['Open', 'In Progress', 'Closed'];
  priorityOptions = ['Low', 'Medium', 'High'];
  assigneeOptions: string[] = [];

  constructor(
    private issueService: IssueService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Check authentication before loading issues
    if (this.isAuthenticated()) {
      this.loadIssues();
    } else {
      this.error = 'Please log in to view issues.';
      // Redirect to auth page after a short delay
      setTimeout(() => {
        this.router.navigate(['/auth']);
      }, 2000);
    }
  }

  isAuthenticated(): boolean {
    return localStorage.getItem('isAuthenticated') === 'true';
  }

  loadIssues(): void {
    this.loading = true;
    this.error = null;
    this.issueService.getIssues(this.filters).subscribe({
      next: (response) => {
        this.issues = response.data;
        this.pagination = {
          page: response.page,
          pageSize: response.pageSize,
          total: response.total,
          totalPages: response.totalPages
        };
        this.updateAssigneeOptions();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading issues:', error);
        this.loading = false;
        this.error = 'Failed to load issues. Please try again.';
      }
    });
  }

  updateAssigneeOptions(): void {
    const assignees = new Set(this.issues.map(issue => issue.assignee).filter(Boolean));
    this.assigneeOptions = Array.from(assignees);
  }

  onRowClick(issue: Issue): void {
    this.router.navigate(['/issues', issue.id]);
  }

  onEditIssue(issue: Issue, event: Event): void {
    event.stopPropagation();
    this.router.navigate(['/edit', issue.id]);
  }

  onCreateIssue(): void {
    console.log('Navigating to create issue form');
    this.router.navigate(['/create']);
  }

  getSortIcon(column: string): string {
    if (this.filters.sortBy !== column) return '';
    return this.filters.sortOrder === 'asc' ? '↑' : '↓';
  }

  getStatusIcon(status: string): string {
    switch (status?.toLowerCase()) {
      case 'open': return '●';
      case 'in progress': return '●';
      case 'closed': return '●';
      default: return '●';
    }
  }

  getPriorityIcon(priority: string): string {
    switch (priority?.toLowerCase()) {
      case 'high': return '▲';
      case 'medium': return '■';
      case 'low': return '▼';
      default: return '■';
    }
  }

  getInitials(name: string): string {
    if (!name) return '?';
    return name.split(' ')
      .map(part => part.charAt(0).toUpperCase())
      .join('')
      .substring(0, 2);
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'No date';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;

    return date.toLocaleDateString();
  }
}