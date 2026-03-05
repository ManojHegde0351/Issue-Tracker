import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Issue, PaginatedResponse, IssueFilters } from '../models/issue.model';

@Injectable({ providedIn: 'root' })
export class IssueService {
  private mockIssues: Issue[] = [
    {
      id: '1',
      title: 'Login page not responsive on mobile devices',
      description: 'The login form overflows on smaller screens and buttons are not properly aligned. Need to fix CSS media queries.',
      status: 'Open',
      priority: 'High',
      assignee: 'john.doe@company.com',
      category: 'bug',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '2',
      title: 'Add dark mode toggle to dashboard',
      description: 'Users have requested a dark mode option for better viewing experience during night hours.',
      status: 'In Progress',
      priority: 'Medium',
      assignee: 'jane.smith@company.com',
      category: 'feature',
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '3',
      title: 'Database connection timeout issues',
      description: 'Intermittent database connection timeouts causing application slowdown during peak hours.',
      status: 'Open',
      priority: 'High',
      assignee: 'bob.wilson@company.com',
      category: 'bug',
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '4',
      title: 'Implement user profile management',
      description: 'Allow users to update their profile information, change passwords, and manage notification preferences.',
      status: 'Closed',
      priority: 'Medium',
      assignee: 'jane.smith@company.com',
      category: 'feature',
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '5',
      title: 'Optimize search functionality performance',
      description: 'Search queries are taking too long to execute. Need to implement indexing and caching.',
      status: 'In Progress',
      priority: 'Low',
      assignee: 'john.doe@company.com',
      category: 'improvement',
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
    }
  ];

  constructor() {
    // Load issues from localStorage if available
    const storedIssues = localStorage.getItem('issues');
    if (storedIssues) {
      this.mockIssues = JSON.parse(storedIssues);
    } else {
      // Save initial mock data to localStorage
      this.saveIssues();
    }
  }

  private saveIssues(): void {
    localStorage.setItem('issues', JSON.stringify(this.mockIssues));
  }

  private filterIssues(issues: Issue[], filters: IssueFilters): Issue[] {
    let filtered = [...issues];

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(issue => 
        issue.title.toLowerCase().includes(searchTerm) ||
        issue.description.toLowerCase().includes(searchTerm)
      );
    }

    if (filters.status) {
      filtered = filtered.filter(issue => issue.status === filters.status);
    }

    if (filters.priority) {
      filtered = filtered.filter(issue => issue.priority === filters.priority);
    }

    if (filters.assignee) {
      filtered = filtered.filter(issue => issue.assignee === filters.assignee);
    }

    if (filters.category) {
      filtered = filtered.filter(issue => issue.category === filters.category);
    }

    // Sort issues
    if (filters.sortBy) {
      filtered.sort((a, b) => {
        const aValue = a[filters.sortBy as keyof Issue] as string;
        const bValue = b[filters.sortBy as keyof Issue] as string;
        
        if (filters.sortOrder === 'desc') {
          return bValue.localeCompare(aValue);
        }
        return aValue.localeCompare(bValue);
      });
    }

    return filtered;
  }

  getIssues(filters: IssueFilters = {}): Observable<PaginatedResponse<Issue>> {
    const filtered = this.filterIssues(this.mockIssues, filters);
    const page = filters.page || 1;
    const pageSize = filters.pageSize || 10;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedIssues = filtered.slice(startIndex, endIndex);

    const response: PaginatedResponse<Issue> = {
      data: paginatedIssues,
      total: filtered.length,
      page: page,
      pageSize: pageSize,
      totalPages: Math.ceil(filtered.length / pageSize)
    };

    // Return immediately without delay for faster loading
    return of(response);
  }

  getIssue(id: string): Observable<Issue> {
    const issue = this.mockIssues.find(i => i.id === id);
    if (!issue) {
      throw new Error(`Issue with id ${id} not found`);
    }
    return of(issue);
  }

  createIssue(issueData: Partial<Issue>): Observable<Issue> {
    const newIssue: Issue = {
      id: Date.now().toString(),
      title: issueData.title || '',
      description: issueData.description || '',
      status: issueData.status || 'Open',
      priority: issueData.priority || 'Medium',
      assignee: issueData.assignee || '',
      category: issueData.category || 'task',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.mockIssues.unshift(newIssue);
    this.saveIssues();
    return of(newIssue);
  }

  updateIssue(id: string, issueData: Partial<Issue>): Observable<void> {
    const index = this.mockIssues.findIndex(i => i.id === id);
    if (index !== -1) {
      this.mockIssues[index] = {
        ...this.mockIssues[index],
        ...issueData,
        updatedAt: new Date().toISOString()
      };
      this.saveIssues();
    }
    return of(void 0);
  }

  deleteIssue(id: string): Observable<void> {
    const index = this.mockIssues.findIndex(i => i.id === id);
    if (index !== -1) {
      this.mockIssues.splice(index, 1);
      this.saveIssues();
    }
    return of(void 0);
  }
}
