import { inject } from '@angular/core';
import type { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const maybeAuthGuard: CanActivateFn = () => {
  const router = inject(Router);
  const authService = inject(AuthService);
  // console.log('auth', isEmptyToken);
  if (!authService.idToken) {
    router.navigateByUrl('/');
  }
  return true;
};
