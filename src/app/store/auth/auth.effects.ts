import { inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  Actions,
  createEffect,
  ofType,
  ROOT_EFFECTS_INIT,
} from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, exhaustMap, map, of, tap } from 'rxjs';
import { GoogleOuthService } from '../../api/external/google-outh.service';
import { ApiClient, User } from '../../api/internal/graphql';
import { StoreDispatchEffect, StoreUnDispatchEffect } from '../../app.types';
import { apiAssertNotNull, extractApiData } from '../../libs/api.functions';
import { AccountActions } from '../account/account.actions';
import { NotificationStore } from '../notifications/notifications.store';
import { AuthStorageService } from './auth-storage.service';
import { AuthActions } from './auth.actions';

const initAuth = (
  actions$ = inject(Actions),
  tokenService = inject(AuthStorageService)
) =>
  actions$.pipe(
    ofType(ROOT_EFFECTS_INIT),
    map(() => tokenService.getToken()),
    map(token =>
      token
        ? AuthActions.initAuthorizedUser({ token })
        : AuthActions.cleanAuthState()
    )
  );

const selectAccountAction = (profile: User & { token: string }) => {
  const accounts = profile.accounts.filter(account => !!account) || [];

  if (profile.accounts.length === 0) {
    return AuthActions.emptyAccounts({
      email: profile.email || 'no_email',
    });
  }
  if (profile.accounts.length !== 1) {
    return AuthActions.showSelectAccountWindow({ accounts });
  } else {
    return AuthActions.successAuthorized({
      account: accounts[0],
      user: profile,
      token: profile.token,
    });
  }
};

const authorizeByApi = (api: ApiClient) => () =>
  api
    .authorize()
    .pipe(
      map(result =>
        apiAssertNotNull(
          extractApiData(result)?.profile,
          'Could not authorize.'
        )
      )
    );

const authorizeByToken = (
  actions$ = inject(Actions),
  authStorage = inject(AuthStorageService),
  api = inject(ApiClient)
) =>
  actions$.pipe(
    ofType(AuthActions.initAuthorizedUser),
    exhaustMap(authorizeByApi(api)),
    map(profile =>
      selectAccountAction({ ...profile, token: authStorage.getToken() || '' })
    ),
    catchError(() => of(AuthActions.shouldNotAuthorizeByToken()))
  );

const authorizeByLogin = (
  action$ = inject(Actions),
  authStorage = inject(AuthStorageService),
  api = inject(ApiClient)
) =>
  action$.pipe(
    ofType(AuthActions.setUserToken),
    tap(({ token }) => {
      authStorage.setToken(token);
    }),
    exhaustMap(authorizeByApi(api)),
    map(profile =>
      selectAccountAction({ ...profile, token: authStorage.getToken() || '' })
    ),
    catchError(error => of(AuthActions.dispatchAuthError({ error })))
  );

const promptLogin = (
  actions$ = inject(Actions),
  outhService = inject(GoogleOuthService),
  store = inject(Store)
) =>
  actions$.pipe(
    ofType(AuthActions.promptLogin),
    tap(() => {
      outhService.login({
        onSignIn: token => {
          store.dispatch(AuthActions.setUserToken({ token: token }));
        },
        onError: () => {
          store.dispatch(
            AuthActions.dispatchAuthError({
              error: 'User email is not verified',
            })
          );
        },
      });
    })
  );

const cleanToken = (
  action$ = inject(Actions),
  tokenService = inject(AuthStorageService)
) =>
  action$.pipe(
    ofType(AuthActions.cleanAuthState),
    tap(() => tokenService.setToken(null))
  );

const logout = (action$ = inject(Actions), router = inject(Router)) =>
  action$.pipe(
    ofType(AuthActions.dispatchLogout),
    tap(() => router.navigate(['/']))
  );

const dispatchCleanState = (action$ = inject(Actions)) =>
  action$.pipe(
    ofType(
      AuthActions.dispatchLogout,
      AuthActions.dispatchAuthError,
      AuthActions.shouldNotAuthorizeByToken
    ),
    map(() => AuthActions.cleanAuthState())
  );

const dispatchAuthError = (
  actions$ = inject(Actions),
  notification = inject(NotificationStore)
) =>
  actions$.pipe(
    ofType(AuthActions.dispatchAuthError),
    tap(({ error }) => {
      notification.addMessage(error, 'error');
    })
  );

const saveAccountToStorage = (
  actions$ = inject(Actions),
  authStorage = inject(AuthStorageService)
) =>
  actions$.pipe(
    ofType(AuthActions.successAuthorized),
    tap(({ account, token }) => {
      authStorage.setToken(token);
      authStorage.setAccount(account);
    })
  );

const setActiveAccount = (actions$ = inject(Actions)) =>
  actions$.pipe(
    ofType(AuthActions.successAuthorized),
    map(({ account }) => ({
      id: account.id,
      name: account.name || undefined,
      avatar: account.avatar || undefined,
      previewlyToken: account.previewlyToken,
      settings: account.settings.reduce(
        (prev, cur) => ({
          ...prev,
          [cur.key]: cur.value,
        }),
        {}
      ),
    })),
    map(account => AccountActions.setAccount({ account }))
  );

const emptyPreviewlyToken = (actions$ = inject(Actions)) =>
  actions$.pipe(
    ofType(AuthActions.emptyPreviewlyToken),
    map(() => AuthActions.dispatchAuthError({ error: 'Empty token' }))
  );

export const authEffects = {
  initAuthEffect: createEffect(initAuth, StoreDispatchEffect),

  promptLogin: createEffect(promptLogin, StoreUnDispatchEffect),
  cleanToken: createEffect(cleanToken, StoreUnDispatchEffect),

  logout: createEffect(logout, StoreUnDispatchEffect),
  cleanAuthState: createEffect(dispatchCleanState, StoreDispatchEffect),

  dispatchAuthError: createEffect(dispatchAuthError, StoreUnDispatchEffect),

  authorizeByToken: createEffect(authorizeByToken, StoreDispatchEffect),
  authorizeByLogin: createEffect(authorizeByLogin, StoreDispatchEffect),

  saveAccountToStorage: createEffect(
    saveAccountToStorage,
    StoreUnDispatchEffect
  ),

  setActiveAccount: createEffect(setActiveAccount, StoreDispatchEffect),
  emptyPreviewlyToken: createEffect(emptyPreviewlyToken, StoreDispatchEffect),
};
