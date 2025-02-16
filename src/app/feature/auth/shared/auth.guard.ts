import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { Observable, filter, map, switchMap, tap } from 'rxjs';
import { accountFeature } from '../../account/store/account.reducer';
import { NewAuthService } from './auth.service';

export const canAuth = (
  _route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
  authService = inject(NewAuthService),
  store = inject(Store)
): Observable<boolean> =>
  authService.isDoneLoading$.pipe(
    filter(isDone => isDone),
    switchMap(() => authService.isAuthenticated$),
    concatLatestFrom(() => store.select(accountFeature.selectActiveAccount)),
    map(
      ([isAuthenticated, activeAccount]) => isAuthenticated && !!activeAccount
    ),
    tap(isAuthenticated => isAuthenticated || authService.login(state.url))
  );
