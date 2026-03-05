import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IssueService } from '../../service/issue.service';
import { Issue } from '../../models/issue.model';

@Component({
  selector: 'app-issue-detail',
  templateUrl: './issue-detail.component.html',
  styleUrls: ['./issue-detail.component.css']
})
export class IssueDetailComponent implements OnInit {
  issue: Issue | null = null;
  loading = false;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private issueService: IssueService
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadIssue(id);
    }
  }

  loadIssue(id: string): void {
    this.loading = true;
    this.error = null;
    
    this.issueService.getIssue(id).subscribe({
      next: (issue) => {
        this.issue = issue;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load issue';
        this.loading = false;
        console.error('Error loading issue:', error);
      }
    });
  }

  onBack(): void {
    this.router.navigate(['/']);
  }

  onEdit(): void {
    if (this.issue) {
      this.router.navigate(['/issues', this.issue.id, 'edit']);
    }
  }

  formatJson(obj: any): string {
    return JSON.stringify(obj, null, 2);
  }
}