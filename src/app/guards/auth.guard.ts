import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { filter, map, take } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  console.log('authGuard executed');
  const router = inject(Router);
  const authService = inject(AuthService);

  return authService.currentUser$.pipe(
    filter((user) => user !== undefined),
    take(1),
    map((user) => {
      if (user) {
        if (route.data?.['admin'] === true && user.role !== 'admin') {
          router.navigate(['/home']); // Vagy egy unauthorized oldalra
          console.log('Access denied - admin privileges required');
          return false;
        }
        return true;
      }
      router.navigate(['/login']);
      console.log('Acces denied - not authenticated');
      return false;
    })
  );
};

export const publicGuard: CanActivateFn = (route, state) => {
  console.log('publicGuard executed');
  const router = inject(Router);
  const authService = inject(AuthService);

  return authService.currentUser$.pipe(
    filter((user) => user !== undefined),
    take(1),
    map((user) => {
      if (!user) {
        return true;
      }
      router.navigate(['/home']);
      console.log('Already authenticated, redirecting to home');
      return false;
    })
  );
};
