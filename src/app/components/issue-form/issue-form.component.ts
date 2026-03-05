import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IssueService } from '../../service/issue.service';
import { Issue } from '../../models/issue-models';

@Component({
  selector: 'app-issue-form',
  templateUrl: './issue-form.component.html',
  styleUrls: ['./issue-form.component.css']
})
export class IssueFormComponent implements OnInit {
  issueForm: FormGroup;
  isEditMode = false;
  issueId: string | null = null;
  loading = false;
  error: string | null = null;
  
  statusOptions = ['Open', 'In Progress', 'Closed'];
  priorityOptions = ['Low', 'Medium', 'High'];
  categoryOptions = [
    { value: 'bug', label: 'Bug Report' },
    { value: 'feature', label: 'Feature Request' },
    { value: 'task', label: 'Task' },
    { value: 'improvement', label: 'Improvement' }
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private issueService: IssueService
  ) {
    this.issueForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(200)]],
      description: [''],
      status: ['Open'],
      priority: ['Medium'],
      assignee: [''],
      category: ['task']
    });
  }

  ngOnInit(): void {
    this.issueId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = this.issueId !== null && this.issueId !== 'new' && this.issueId !== '';

    if (this.isEditMode && this.issueId) {
      this.loadIssue(this.issueId);
    } else {
      // Creating new issue - form is already initialized with default values
      console.log('Creating new issue - form ready');
    }
  }

  loadIssue(id: string): void {
    this.loading = true;
    this.issueService.getIssue(id).subscribe({
      next: (issue) => {
        this.issueForm.patchValue({
          title: issue.title,
          description: issue.description,
          status: issue.status,
          priority: issue.priority,
          assignee: issue.assignee,
          category: issue.category || 'task'
        });
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load issue';
        this.loading = false;
        console.error('Error loading issue:', error);
      }
    });
  }

  onSubmit(): void {
    if (this.issueForm.valid) {
      this.loading = true;
      this.error = null;

      const issueData = this.issueForm.value;

      if (this.isEditMode && this.issueId) {
        this.issueService.updateIssue(this.issueId, issueData).subscribe({
          next: () => {
            this.router.navigate(['/issues']);
          },
          error: (error) => {
            this.error = 'Failed to update issue';
            this.loading = false;
            console.error('Error updating issue:', error);
          }
        });
      } else {
        this.issueService.createIssue(issueData).subscribe({
          next: (issue) => {
            this.router.navigate(['/issues']);
          },
          error: (error) => {
            this.error = 'Failed to create issue';
            this.loading = false;
            console.error('Error creating issue:', error);
          }
        });
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  onCancel(): void {
    if (this.isEditMode && this.issueId) {
      this.router.navigate(['/issues', this.issueId]);
    } else {
      this.router.navigate(['/dashboard']);
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.issueForm.controls).forEach(key => {
      const control = this.issueForm.get(key);
      control?.markAsTouched();
    });
  }
}
