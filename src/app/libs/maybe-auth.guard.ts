import { inject } from '@angular/core';
import type { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const maybeAuthGuard: CanActivateFn = () => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const isEmptyToken = !!authService.idToken;
  // console.log('auth', isEmptyToken);
  if (isEmptyToken == false) {
    router.navigateByUrl('/');
  }
  return true;
};
