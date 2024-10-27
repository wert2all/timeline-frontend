import { inject } from '@angular/core';
import type { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { authFeature } from '../store/auth/auth.reducer';

export const maybeAuthGuard: CanActivateFn = () => {
  const store = inject(Store);
  const router = inject(Router);

  const isAuthorized = store.selectSignal(authFeature.isAuthorized)();
  const isEmptyToken = store.selectSignal(authFeature.selectToken)() != null;
  // console.log(isAuthorized, isEmptyToken);
  const canActivate = isAuthorized || isEmptyToken;
  if (canActivate == false) {
    router.navigateByUrl('/');
  }
  return canActivate;
};
