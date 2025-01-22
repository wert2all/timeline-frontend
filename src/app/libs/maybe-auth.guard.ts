import { inject } from '@angular/core';
import type { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';
import { SharedAuthTokenService } from '../shared/services/auth-token.service';

export const maybeAuthGuard: CanActivateFn = () => {
  const router = inject(Router);
  const authService = inject(SharedAuthTokenService);
  // console.log('auth', isEmptyToken);
  if (!authService.token) {
    router.navigateByUrl('/');
  }
  return true;
};
