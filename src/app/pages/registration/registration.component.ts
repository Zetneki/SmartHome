import { Component, inject } from '@angular/core';
import {
  FormGroup,
  ReactiveFormsModule,
  Validators,
  FormBuilder,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-registration',
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
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss',
})
export class RegistrationComponent {
  registerForm: FormGroup;
  isLoading: boolean = false;
  signupError: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(6)]],
      email: ['', [Validators.required, Validators.email]],
      role: ['user'],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
    });
  }

  clearError() {
    this.signupError = '';
  }

  getControl(controlName: string) {
    return this.registerForm.get(controlName);
  }

  onSubmit() {
    if (
      this.registerForm.value.password !==
      this.registerForm.value.confirmPassword
    ) {
      this.signupError = 'Passwords do not match';
      return;
    }

    if (this.registerForm.invalid) {
      this.signupError = 'Please fill out the form correctly';
      return;
    }

    const emailValue = this.registerForm.get('email')?.value || '';
    const passwordValue = this.registerForm.get('password')?.value || '';
    const nameValue = this.registerForm.get('name')?.value || '';

    this.isLoading = true;
    this.signupError = '';

    this.authService
      .signUp(emailValue, passwordValue, nameValue)
      .then((userCredential) => {
        console.log('Registration successful:', userCredential.user);
        this.router.navigateByUrl('/home');
      })
      .catch((error) => {
        console.error('Registration error:', error);
        this.isLoading = false;

        switch (error.code) {
          case 'auth/email-already-in-use':
            this.signupError = 'This email is already registered';
            break;
          case 'auth/invalid-email':
            this.signupError = 'Invalid email address';
            break;
          case 'auth/weak-password':
            this.signupError = 'Password is too weak';
            break;
          default:
            this.signupError = 'Registration failed. Please try again later.';
        }
      });
  }
}
