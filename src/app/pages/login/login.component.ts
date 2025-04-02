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
  store = inject(AuthService);

  loginForm: FormGroup;
  loginError = '';

  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private AuthService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  getControl(controlName: string) {
    return this.loginForm.get(controlName);
  }

  clearError() {
    this.loginError = '';
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;

      this.AuthService.signIn(this.loginForm.value).subscribe({
        next: (response) => {
          console.log('Registration successful', response);
          this.loginError = '';
          this.router.navigate(['/home']);
        },
        error: (error) => {
          this.isLoading = false;
          this.loginError = error || 'An unexpected error occurred';
        },
        complete: () => {
          this.isLoading = false; // Hide loading state

          console.log('Successfully logged in');
          console.log(this.store.users$);
        },
      });
    } else {
      this.loginError = 'Please fill out the form correctly';
    }
  }
}
