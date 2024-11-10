import { inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  Actions,
  createEffect,
  ofType,
  ROOT_EFFECTS_INIT,
} from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { catchError, exhaustMap, map, of, tap } from 'rxjs';
import { GoogleOuthService } from '../../api/external/google-outh.service';
import { ApiClient } from '../../api/internal/graphql';
import { StoreDispatchEffect, StoreUnDispatchEffect } from '../../app.types';
import { NotificationStore } from '../notifications/notifications.store';
import { AuthStorageService } from './auth-storage.service';
import { AuthActions } from './auth.actions';
import { authFeature } from './auth.reducer';

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
        : AuthActions.emptyInitialToken()
    )
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
        onSignIn: (token, user) => {
          store.dispatch(
            AuthActions.setTokenAndProfile({ token: token, profile: user })
          );
        },
        onNotDisplayed: () => {
          store.dispatch(AuthActions.promptNotDisplayed());
        },
        onNotVerifiedEmail: () => {
          store.dispatch(AuthActions.userEmailIsNotVerified());
        },
      });
    })
  );

const promptNotDisplayed = (
  actions$ = inject(Actions),
  notification = inject(NotificationStore)
) =>
  actions$.pipe(
    ofType(AuthActions.promptNotDisplayed),
    tap(() => {
      notification.addMessage('Google auth not displayed', 'error');
    })
  );

const userEmailIsNotVerified = (
  action$ = inject(Actions),
  notification = inject(NotificationStore)
) =>
  action$.pipe(
    ofType(AuthActions.userEmailIsNotVerified),
    tap(() => notification.addMessage('User email is not verified', 'error'))
  );

const loadUserAfterInit = (
  action$ = inject(Actions),
  api = inject(ApiClient)
) => {
  return action$.pipe(
    ofType(AuthActions.initAuthorizedUser),
    exhaustMap(({ token }) =>
      api.authorize().pipe(
        map(result => result.data?.profile || null),
        map(profile =>
          profile
            ? AuthActions.successLoadUserAfterInit({
                token: token,
                user: profile,
              })
            : AuthActions.coulndNotLoadUserAfterInit()
        ),
        catchError(() => of(AuthActions.coulndNotLoadUserAfterInit()))
      )
    )
  );
};

const setToken = (
  action$ = inject(Actions),
  tokenService = inject(AuthStorageService),
  api = inject(ApiClient)
) =>
  action$.pipe(
    ofType(AuthActions.setTokenAndProfile),
    tap(({ token }) => tokenService.setToken(token)),
    exhaustMap(({ token }) =>
      api.authorize().pipe(
        map(result => result.data?.profile || null),
        map(profile =>
          profile
            ? AuthActions.successLoadUser({ token: token, user: profile })
            : AuthActions.emptyProfile()
        ),
        catchError(exception =>
          of(AuthActions.apiException({ exception: exception }))
        )
      )
    )
  );

const setAuthorized = (action$ = inject(Actions)) =>
  action$.pipe(
    ofType(AuthActions.successLoadUser, AuthActions.successLoadUserAfterInit),
    map(({ token, user }) =>
      AuthActions.authorized({
        token: token,
        user: {
          email: user.email,
          accounts:
            user.accounts
              .filter(account => !!account)
              .map(account => ({
                id: account.id,
                avatar: account.avatar || undefined,
                name: account.name || undefined,
              })) || [],
        },
      })
    )
  );

const redirectAfterLogin = (
  actions$ = inject(Actions),
  router = inject(Router)
) =>
  actions$.pipe(
    ofType(AuthActions.successLoadUser),
    tap(() => router.navigate(['/', 'my']))
  );

const authorized = (
  action$ = inject(Actions),
  tokenService = inject(AuthStorageService)
) =>
  action$.pipe(
    ofType(AuthActions.authorized),
    tap(({ token }) => tokenService.setToken(token))
  );
const emptyProfile = (
  action$ = inject(Actions),
  notification = inject(NotificationStore)
) =>
  action$.pipe(
    ofType(AuthActions.emptyProfile),
    tap(() => notification.addMessage('Cannot authorize', 'error'))
  );

const apiException = (
  action$ = inject(Actions),
  notification = inject(NotificationStore)
) =>
  action$.pipe(
    ofType(AuthActions.apiException),
    tap(() =>
      notification.addMessage('Something went wrong. Try again later', 'error')
    )
  );

const cleanToken = (
  action$ = inject(Actions),
  tokenService = inject(AuthStorageService)
) =>
  action$.pipe(
    ofType(
      AuthActions.promptNotDisplayed,
      AuthActions.userEmailIsNotVerified,
      AuthActions.emptyProfile,
      AuthActions.apiException,
      AuthActions.logout,
      AuthActions.coulndNotLoadUserAfterInit
    ),
    tap(() => tokenService.setToken(null))
  );

const logout = (action$ = inject(Actions), router = inject(Router)) =>
  action$.pipe(
    ofType(AuthActions.logout),
    tap(() => router.navigate(['/']))
  );

const dispatchCleanState = (action$ = inject(Actions)) => {
  return action$.pipe(
    ofType(
      AuthActions.promptNotDisplayed,
      AuthActions.userEmailIsNotVerified,
      AuthActions.emptyProfile,
      AuthActions.apiException,
      AuthActions.logout,
      AuthActions.coulndNotLoadUserAfterInit
    ),
    map(() => AuthActions.cleanAuthState())
  );
};

const dispatchSetAccount = (
  actions$ = inject(Actions),
  storage = inject(AuthStorageService)
) =>
  actions$.pipe(
    ofType(AuthActions.authorized),
    map(() =>
      AuthActions.updateActiveAccountFromStorage({
        accountId: storage.getAccountId(),
      })
    )
  );

const updateAccountFromStorage = (
  action$ = inject(Actions),
  store = inject(Store)
) =>
  action$.pipe(
    ofType(AuthActions.updateActiveAccountFromStorage),
    concatLatestFrom(() =>
      store
        .select(authFeature.selectAuthorizedUser)
        .pipe(map(user => user?.accounts))
    ),
    map(([{ accountId }, accounts]) => ({
      exist: accounts?.find(acc => acc.id.toString() === accountId),
      accounts: accounts || [],
    })),
    map(data =>
      data.exist
        ? AuthActions.successUpdateActiveAccountFromStorage({
            account: data.exist,
          })
        : AuthActions.selectActiveAccount({ accounts: data.accounts })
    )
  );

const dispatchSelectAccount = (
  actions = inject(Actions),
  store = inject(Store)
) =>
  actions.pipe(
    ofType(AuthActions.selectActiveAccount),
    concatLatestFrom(() => store.select(authFeature.selectAuthorizedUser)),
    map(([{ accounts }, user]) => {
      if (accounts.length === 0) {
        return AuthActions.emptyAccounts({ email: user?.email || 'no_email' });
      }
      if (accounts.length !== 1) {
        return AuthActions.showSelectAcccountWindow({ accounts: accounts });
      } else {
        return AuthActions.setOneExistAccountAsActive();
      }
    })
  );

export const authEffects = {
  initAuthEffect: createEffect(initAuth, StoreDispatchEffect),
  loadUserAfterInit: createEffect(loadUserAfterInit, StoreDispatchEffect),

  redirectAfterLogin: createEffect(redirectAfterLogin, StoreUnDispatchEffect),
  promptLogin: createEffect(promptLogin, StoreUnDispatchEffect),
  setToken: createEffect(setToken, StoreDispatchEffect),
  cleanToke: createEffect(cleanToken, StoreUnDispatchEffect),
  setAuthorized: createEffect(setAuthorized, StoreDispatchEffect),
  authorized: createEffect(authorized, StoreUnDispatchEffect),

  promptNotDisplayed: createEffect(promptNotDisplayed, StoreUnDispatchEffect),
  userEmailIsNotVerified: createEffect(
    userEmailIsNotVerified,
    StoreUnDispatchEffect
  ),

  logout: createEffect(logout, StoreUnDispatchEffect),

  emptyProfile: createEffect(emptyProfile, StoreUnDispatchEffect),
  apiException: createEffect(apiException, StoreUnDispatchEffect),

  cleanAuthState: createEffect(dispatchCleanState, StoreDispatchEffect),

  dispatchSetAccount: createEffect(dispatchSetAccount, StoreDispatchEffect),
  updateAccountFromStorage: createEffect(
    updateAccountFromStorage,
    StoreDispatchEffect
  ),

  dispatchSelectAccount: createEffect(
    dispatchSelectAccount,
    StoreDispatchEffect
  ),
};
