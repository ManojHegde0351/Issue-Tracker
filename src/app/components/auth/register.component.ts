import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      role: ['user', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    
    return null;
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      // Real registration logic
      setTimeout(() => {
        const { fullName, email, password, role } = this.registerForm.value;
        
        // Check if user already exists
        const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        const existingUser = registeredUsers.find((u: any) => u.email === email);
        
        if (existingUser) {
          this.errorMessage = 'User with this email already exists. Please use a different email or login.';
          this.isLoading = false;
          return;
        }
        
        // Store new user
        const userData = {
          fullName,
          email,
          password, // In real app, this would be hashed
          role,
          createdAt: new Date().toISOString()
        };
        
        registeredUsers.push(userData);
        localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
        
        this.successMessage = 'Account created successfully! Redirecting to login...';
        
        // Redirect to login after 2 seconds
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
        
        this.isLoading = false;
      }, 1000);
    }
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  goToLandingPage() {
    // Navigate back to landing page
    const appRoot = document.querySelector('app-root') as HTMLElement;
    const landingPage = document.getElementById('landing-page');
    
    if (appRoot && landingPage) {
      appRoot.style.display = 'none';
      landingPage.style.display = 'block';
      window.history.pushState({}, '', '/');
    }
  }
}
