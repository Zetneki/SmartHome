import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { TruncatePipe } from '../../pipes/truncate.pipe';

@Component({
  selector: 'app-profile',
  imports: [AsyncPipe, RouterLink, MatButtonModule, TruncatePipe],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  store = inject(AuthService);
}
