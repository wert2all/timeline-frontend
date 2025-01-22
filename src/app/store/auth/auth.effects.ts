import { inject } from '@angular/core';
import {
  Actions,
  ROOT_EFFECTS_INIT,
  createEffect,
  ofType,
} from '@ngrx/effects';
import { catchError, exhaustMap, map, of, tap } from 'rxjs';
import { ApiClient, User } from '../../api/internal/graphql';
import { StoreDispatchEffect, Undefined } from '../../app.types';
import { NavigationActions } from '../../shared/store/navigation/navigation.actions';
import { Account } from '../../shared/store/shared/shared.types';
import { AccountActions } from '../account/account.actions';
import { AccountUser } from '../account/account.types';
import { AuthActions } from './auth.actions';
import { AuthService } from './auth.service';

const convertApiProfileToAccount = (
  user: User | Undefined
): AccountUser | null =>
  user
    ? {
        id: user.id,
        name: user.name || null,
        accounts: user.accounts
          .filter(account => !!account)
          .map(
            (account): Account => ({
              id: account.id,
              name: account.name || undefined,
              previewlyToken: account.previewlyToken,
              settings: account.settings.reduce(
                (prev, cur) => ({
                  ...prev,
                  [cur.key]: cur.value,
                }),
                {}
              ),
            })
          ),
      }
    : null;

const init = (
  actions$ = inject(Actions),
  authService = inject(AuthService),
  api = inject(ApiClient)
) =>
  actions$.pipe(
    ofType(ROOT_EFFECTS_INIT),
    map(() => authService.idToken),
    exhaustMap((token: string | null) =>
      token
        ? api.authorize().pipe(
            map(result => result.data?.profile),
            map(user => convertApiProfileToAccount(user))
          )
        : of(null)
    ),
    map(accountUser =>
      accountUser
        ? AccountActions.setUser({ user: accountUser })
        : AuthActions.dispatchEmptyUserProfileOnInit()
    ),
    catchError(() => of(AuthActions.dispatchBackendApiAuthError()))
  );

const apiAuthorizeOnRedirect = (
  actions$ = inject(Actions),
  api = inject(ApiClient)
) =>
  actions$.pipe(
    ofType(AuthActions.dispatchApiAuthorizeOnRedirect),
    exhaustMap(() =>
      api.authorize().pipe(
        map(result => result.data?.profile),
        map(user => convertApiProfileToAccount(user))
      )
    ),
    map(accountUser =>
      accountUser
        ? AccountActions.setUserOnRedirect({ user: accountUser })
        : AuthActions.dispatchEmptyUserProfileOnRedirect()
    ),
    catchError(() => of(AuthActions.dispatchBackendApiAuthError()))
  );

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
  init: createEffect(init, StoreDispatchEffect),
  dispatchApiAuthorizeOnRedirect: createEffect(
    apiAuthorizeOnRedirect,
    StoreDispatchEffect
  ),
  logout: createEffect(logout, StoreDispatchEffect),
  redirectAfterLogout: createEffect((actions$ = inject(Actions)) => {
    return actions$.pipe(
      ofType(AuthActions.afterLogout),
      map(() => NavigationActions.toHome())
    );
  }, StoreDispatchEffect),
};
