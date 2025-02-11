import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, filter, switchMap, tap } from 'rxjs';
import { NewAuthService } from './auth.service';

export const canAuth = (
  _route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
  authService = inject(NewAuthService)
): Observable<boolean> =>
  authService.isDoneLoading$.pipe(
    filter(isDone => isDone),
    switchMap(_ => authService.isAuthenticated$),
    tap(isAuthenticated => isAuthenticated || authService.login(state.url))
  );
