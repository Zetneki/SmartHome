import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIcon } from '@angular/material/icon';
import { AsyncPipe, NgIf } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { map, Observable, Subscription } from 'rxjs';
import { AppUser } from '../../models/user.model';

@Component({
  selector: 'app-header',
  imports: [
    MatToolbarModule,
    MatButtonModule,
    RouterLink,
    MatSidenavModule,
    MatIcon,
    NgIf,
    AsyncPipe,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit, OnDestroy {
  isOpen = false;
  isDarkMode = false;
  currentUser$: Observable<AppUser | null | undefined>;
  isAdmin = false;
  private userSubscription!: Subscription;

  constructor(private renderer: Renderer2, public authService: AuthService) {
    this.currentUser$ = authService.currentUser$;

    this.userSubscription = this.currentUser$.subscribe((user) => {
      this.isAdmin = user?.role === 'admin';
    });
  }

  toggleSidebar() {
    this.isOpen = !this.isOpen;
  }

  ngOnInit() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      this.isDarkMode = savedTheme === 'dark';
      this.renderer.setAttribute(
        document.documentElement,
        'data-theme',
        savedTheme
      );
    }
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    const theme = this.isDarkMode ? 'dark' : 'light';
    this.renderer.setAttribute(document.documentElement, 'data-theme', theme);

    localStorage.setItem('theme', theme);
  }

  ngOnDestroy() {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }
}
