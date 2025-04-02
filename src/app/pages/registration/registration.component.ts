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
  store = inject(AuthService);

  registerForm: FormGroup;
  signupError = '';

  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private AuthService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(5)]],
      email: ['', [Validators.required, Validators.email]],
      role: ['user'],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
    });
  }

  getControl(controlName: string) {
    return this.registerForm.get(controlName);
  }

  clearError() {
    this.signupError = '';
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.isLoading = true;

      this.AuthService.signUp(this.registerForm.value).subscribe({
        next: (response) => {
          console.log('Registration successful', response);
          this.signupError = '';
          this.router.navigate(['/login']);
        },
        error: (error) => {
          this.isLoading = false;
          this.signupError = error || 'An unexpected error occurred';
        },
        complete: () => {
          this.isLoading = false;

          console.log('Successfully signed up');
          console.log(this.store.users$);
        },
      });
    } else {
      this.signupError = 'Please fill out the form correctly';
    }
  }
}
