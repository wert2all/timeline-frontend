import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, tap } from 'rxjs';
import { StoreDispatchEffect } from '../../app.types';
import { NavigationActions } from '../../shared/store/navigation/navigation.actions';
import { AuthActions } from './auth.actions';
import { AuthService } from './auth.service';

const logout = (
  actions$ = inject(Actions),
  authService = inject(AuthService)
) =>
  actions$.pipe(
    ofType(
      AuthActions.dispatchLogout,
      AuthActions.dispatchEmptyPreviewlyTokenError,
      AuthActions.dispatchBackendApiAuthError
    ),
    tap(() => authService.logout()),
    map(() => AuthActions.afterLogout())
  );

export const authEffects = {
  logout: createEffect(logout, StoreDispatchEffect),
  redirectAfterLogout: createEffect((actions$ = inject(Actions)) => {
    return actions$.pipe(
      ofType(AuthActions.afterLogout),
      map(() => NavigationActions.toHome())
    );
  }, StoreDispatchEffect),
};
