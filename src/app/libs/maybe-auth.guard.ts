import { inject } from '@angular/core';
import type { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AuthService } from '../services/auth.service';
import { accountFeature } from '../store/account/account.reducer';

export const maybeAuthGuard: CanActivateFn = () => {
  const store = inject(Store);
  const router = inject(Router);
  const authService = inject(AuthService);
  const isAuthorized = store.selectSignal(accountFeature.isAuthorized)();
  const isEmptyToken = !!authService.idToken;
  // console.log(isAuthorized, isEmptyToken);
  const canActivate = isAuthorized || isEmptyToken;
  if (canActivate == false) {
    router.navigateByUrl('/');
  }
  return canActivate;
};
