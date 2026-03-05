import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  isLoginMode = true;
  loginForm: FormGroup;
  registerForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  // Password validation checklist
  passwordChecklist = {
    minLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSpecial: false
  };

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.registerForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      role: ['user', [Validators.required]]
    }, { validators: this.passwordMatchValidator });

    // Watch password changes for validation checklist
    this.registerForm.get('password')?.valueChanges.subscribe(password => {
      this.updatePasswordChecklist(password || '');
    });
  }

  ngOnInit() {
    // Check route to determine initial mode
    const url = this.router.url;
    this.isLoginMode = url.includes('login') || url === '/auth';
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

  updatePasswordChecklist(password: string) {
    this.passwordChecklist = {
      minLength: password.length >= 6,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };
  }

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
    this.errorMessage = '';
    this.successMessage = '';
  }

  onLogin() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      setTimeout(() => {
        const { email, password } = this.loginForm.value;
        
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

  onRegister() {
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      setTimeout(() => {
        const { fullName, email, password, role } = this.registerForm.value;
        
        const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        const existingUser = registeredUsers.find((u: any) => u.email === email);
        
        if (existingUser) {
          this.errorMessage = 'User with this email already exists. Please use a different email or login.';
          this.isLoading = false;
          return;
        }
        
        const userData = {
          fullName,
          email,
          password,
          role,
          createdAt: new Date().toISOString()
        };
        
        registeredUsers.push(userData);
        localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
        
        this.successMessage = 'Account created successfully! You can now login.';
        
        setTimeout(() => {
          this.isLoginMode = true;
          this.successMessage = '';
        }, 2000);
        
        this.isLoading = false;
      }, 1000);
    }
  }

  goToLandingPage() {
    // Redirect to dashboard if authenticated, otherwise stay on auth page
    if (localStorage.getItem('isAuthenticated') === 'true') {
      this.router.navigate(['/dashboard']);
    }
  }
}
