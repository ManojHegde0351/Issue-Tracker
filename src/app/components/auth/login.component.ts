import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      // Real authentication logic
      setTimeout(() => {
        const { email, password } = this.loginForm.value;
        
        // Check if user exists in localStorage (registered users)
        const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        const user = registeredUsers.find((u: any) => u.email === email && u.password === password);
        
        if (user) {
          localStorage.setItem('isAuthenticated', 'true');
          localStorage.setItem('userRole', user.role);
          localStorage.setItem('userName', user.fullName);
          localStorage.setItem('userEmail', user.email);
          this.router.navigate(['/dashboard']);
        } else {
          this.errorMessage = 'Invalid email or password. Please register if you don\'t have an account.';
        }
        
        this.isLoading = false;
      }, 1000);
    }
  }

  goToRegister() {
    this.router.navigate(['/register']);
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
