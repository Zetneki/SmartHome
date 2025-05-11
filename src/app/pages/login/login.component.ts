import { Component, inject } from '@angular/core';
import {
  FormGroup,
  ReactiveFormsModule,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    RouterLink,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading: boolean = false;
  loginError: string = '';
  showLoginForm: boolean = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  clearError() {
    this.loginError = '';
  }

  getControl(controlName: string) {
    return this.loginForm.get(controlName);
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginError = 'Please fill out the form correctly';
      return;
    }

    const emailValue = this.loginForm.get('email')?.value || '';
    const passwordValue = this.loginForm.get('password')?.value || '';

    this.isLoading = true;
    this.showLoginForm = false;
    this.loginError = '';

    this.authService
      .signIn(emailValue, passwordValue)
      .then((userCredential) => {
        console.log('asdasdasd', this.authService.currentUserSubject.value);
        console.log('Login successful:', userCredential.user);
        this.router.navigateByUrl('/home');
      })
      .catch((error) => {
        console.error('Login error:', error);
        this.isLoading = false;
        this.showLoginForm = true;

        switch (error.code) {
          case 'auth/user-not-found':
            this.loginError = 'No account found with this email address';
            break;
          case 'auth/wrong-password':
            this.loginError = 'Incorrect password';
            break;
          case 'auth/invalid-credential':
            this.loginError = 'Invalid email or password';
            break;
          default:
            this.loginError = 'Authentication failed. Please try again later.';
        }
      });
  }
}
