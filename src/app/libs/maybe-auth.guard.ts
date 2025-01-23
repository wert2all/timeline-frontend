import { inject } from '@angular/core';
import type { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';
import { SharedAuthTokenProvider } from '../shared/services/auth-token.provider';

export const maybeAuthGuard: CanActivateFn = () => {
  const router = inject(Router);
  const tokenProvider = inject(SharedAuthTokenProvider);
  // console.log('auth', isEmptyToken);
  if (!tokenProvider.token) {
    router.navigateByUrl('/');
  }
  return true;
};
