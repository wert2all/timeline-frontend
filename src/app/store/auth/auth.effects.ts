import { inject } from '@angular/core';
import {
  Actions,
  createEffect,
  ofType,
  ROOT_EFFECTS_INIT,
} from '@ngrx/effects';
import { AuthActions } from './auth.actions';
import { catchError, exhaustMap, map, of, tap } from 'rxjs';
import { NotificationStore } from '../notifications/notifications.store';
import { ApiClient } from '../../api/graphql';
import { StoreDispatchEffect, StoreUnDispatchEffect } from '../../app.types';
import { AuthTokenStorageService } from './auth-token-storage.service';

const initAuth = (actions$ = inject(Actions)) =>
  actions$.pipe(
    ofType(ROOT_EFFECTS_INIT),
    map(() => AuthActions.initState())
  );
const promptNotDisplayed = (
  actions$ = inject(Actions),
  notification = inject(NotificationStore)
) =>
  actions$.pipe(
    ofType(AuthActions.promptNotDisplayed),
    tap(({ reason }) => {
      notification.addMessage('Google auth not displayed: ' + reason, 'error');
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

const setToken = (action$ = inject(Actions), api = inject(ApiClient)) =>
  action$.pipe(
    ofType(AuthActions.setTokenAndProfile),
    exhaustMap(({ token }) =>
      api.authorize().pipe(
        map(result => result.data?.profile),
        map(profile =>
          profile
            ? AuthActions.authorized({
                token: token,
                user: {
                  uuid: profile.id,
                  name: profile.name,
                  avatar: profile.avatar || null,
                },
              })
            : AuthActions.emptyProfile()
        ),
        catchError(exception =>
          of(AuthActions.apiException({ exception: exception }))
        )
      )
    )
  );

const authorized = (
  action$ = inject(Actions),
  tokenService = inject(AuthTokenStorageService)
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
  tokenService = inject(AuthTokenStorageService)
) =>
  action$.pipe(
    ofType(
      AuthActions.promptNotDisplayed,
      AuthActions.userEmailIsNotVerified,
      AuthActions.emptyProfile,
      AuthActions.apiException
    ),
    tap(() => tokenService.setToken(null))
  );
export const authEffects = {
  initAuthEffect: createEffect(initAuth, StoreDispatchEffect),

  setToken: createEffect(setToken, { functional: true, dispatch: true }),
  cleanToke: createEffect(cleanToken, StoreUnDispatchEffect),
  authorized: createEffect(authorized, StoreUnDispatchEffect),

  promptNotDisplayed: createEffect(promptNotDisplayed, StoreUnDispatchEffect),
  userEmailIsNotVerified: createEffect(
    userEmailIsNotVerified,
    StoreUnDispatchEffect
  ),

  emptyProfile: createEffect(emptyProfile, StoreUnDispatchEffect),
  apiException: createEffect(apiException, StoreUnDispatchEffect),
};
