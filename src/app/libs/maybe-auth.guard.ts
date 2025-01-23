import { inject } from '@angular/core';
import type { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';
import { AuthFacade } from '../feature/auth/auth.facade';

export const maybeAuthGuard: CanActivateFn = () => {
  const router = inject(Router);
  const tokenProvider = inject(AuthFacade);
  // console.log('auth', isEmptyToken);
  if (!tokenProvider.getToken()) {
    router.navigateByUrl('/');
  }
  return true;
};
