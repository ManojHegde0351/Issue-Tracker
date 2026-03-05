import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  isLoading = false;
  isEditMode = false;

  // Mock user data - in real app this would come from service
  userProfile = {
    fullName: 'John Doe',
    email: 'john.doe@company.com',
    role: 'Senior Developer',
    bio: 'Experienced full-stack developer with expertise in Angular and Node.js',
    avatar: 'JD',
    joinDate: new Date('2024-01-15'),
    stats: {
      issuesCreated: 12,
      issuesResolved: 8,
      inProgress: 4
    }
  };

  constructor(private fb: FormBuilder) {
    this.profileForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      role: ['', [Validators.required]],
      bio: ['']
    });
  }

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.isLoading = true;

    // Simulate API call
    setTimeout(() => {
      this.profileForm.patchValue({
        fullName: this.userProfile.fullName,
        email: this.userProfile.email,
        role: this.userProfile.role,
        bio: this.userProfile.bio
      });
      this.isLoading = false;
    }, 800);
  }

  toggleEditMode(): void {
    this.isEditMode = !this.isEditMode;
    if (!this.isEditMode) {
      // Reset form if canceling edit
      this.loadProfile();
    }
  }

  onSubmit(): void {
    if (this.profileForm.valid) {
      this.isLoading = true;

      // Simulate API call
      setTimeout(() => {
        // Update user profile
        Object.assign(this.userProfile, this.profileForm.value);
        this.isEditMode = false;
        this.isLoading = false;

        // Show success message
        this.showNotification('Profile updated successfully!', 'success');
      }, 1000);
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.profileForm.controls).forEach(key => {
      const control = this.profileForm.get(key);
      control?.markAsTouched();
    });
  }

  private showNotification(message: string, type: string): void {
    // Simple notification system - could be enhanced with a service
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
      <div class="notification-content">
        <span class="notification-icon">${type === 'success' ? '✅' : 'ℹ️'}</span>
        <span class="notification-message">${message}</span>
      </div>
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.remove();
    }, 3000);
  }

  formatJoinDate(): string {
    return this.userProfile.joinDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}
