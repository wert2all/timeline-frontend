import { inject } from '@angular/core';
import type { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { accountFeature } from '../store/account/account.reducer';
import { AuthStorageService } from '../store/auth/auth-storage.service';

export const maybeAuthGuard: CanActivateFn = () => {
  const store = inject(Store);
  const router = inject(Router);
  const tokenStorage = inject(AuthStorageService);

  const isAuthorized = store.selectSignal(accountFeature.isAuthorized)();
  const isEmptyToken = !!tokenStorage.getToken();
  // console.log(isAuthorized, isEmptyToken);
  const canActivate = isAuthorized || isEmptyToken;
  if (canActivate == false) {
    router.navigateByUrl('/');
  }
  return canActivate;
};
