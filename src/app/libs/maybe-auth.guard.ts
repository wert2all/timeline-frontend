import { inject } from '@angular/core';
import type { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AuthStorageService } from '../store/auth/auth-storage.service';
import { authFeature } from '../store/auth/auth.reducer';

export const maybeAuthGuard: CanActivateFn = () => {
  const store = inject(Store);
  const router = inject(Router);
  const tokenStorage = inject(AuthStorageService);

  const isAuthorized = store.selectSignal(authFeature.isAuthorized)();
  const isEmptyToken = !!tokenStorage.getToken();
  // console.log(isAuthorized, isEmptyToken);
  const canActivate = isAuthorized || isEmptyToken;
  if (canActivate == false) {
    router.navigateByUrl('/');
  }
  return canActivate;
};
