import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { filter, map, take } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return authService.currentUser$.pipe(
    filter((user) => user !== undefined),
    take(1),
    map((user) => {
      if (user) {
        if (route.data?.['admin'] === true && user.role !== 'admin') {
          router.navigate(['/home']);
          return false;
        }
        return true;
      }
      router.navigate(['/login']);
      return false;
    })
  );
};

export const publicGuard: CanActivateFn = (route, state) => {
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
      return false;
    })
  );
};
