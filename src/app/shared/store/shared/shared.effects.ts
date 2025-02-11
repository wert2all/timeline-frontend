import { inject } from '@angular/core';
import {
  Actions,
  ROOT_EFFECTS_INIT,
  createEffect,
  ofType,
} from '@ngrx/effects';
import { catchError, exhaustMap, map, of, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { StoreDispatchEffect, StoreUnDispatchEffect } from '../../../app.types';
import { CurrentAccountProvider } from '../../../feature/account/current.provider';
import { CachedAccountsProvider } from '../../../feature/account/storage/cached-accounts.provider';
import { NewAuthService } from '../../../feature/auth/shared/auth.service';
import { TokenProvider } from '../../../feature/auth/shared/token.provider';
import { ImagesTaskExecutorFactory } from '../../../feature/task/executors/images.factory';
import { NotificationStore } from '../../../feature/ui/layout/store/notification/notifications.store';
import { TaskActions } from '../../../store/task/task.actions';
import { NavigationActions } from '../navigation/navigation.actions';
import { SharedActions } from './shared.actions';

const init = (
  actions$ = inject(Actions),
  tokenProvider = inject(TokenProvider),
  accountStorage = inject(CachedAccountsProvider),
  currentAccountIdProvider = inject(CurrentAccountProvider)
) =>
  actions$.pipe(
    ofType(ROOT_EFFECTS_INIT),
    exhaustMap(() => {
      if (tokenProvider.getToken()) {
        const currentAccountId = currentAccountIdProvider.getActiveAccountId();
        if (currentAccountId) {
          return accountStorage.getAccount(currentAccountId);
        }
      }
      return of(null);
    }),
    map(account =>
      account
        ? SharedActions.setActiveAccountAfterInit({ account })
        : SharedActions.emptyActiveAccount()
    ),
    catchError(err => of(SharedActions.errorOnInitAuth({ error: err })))
  );

const sendNotification = (
  actions$ = inject(Actions),
  notificationStore = inject(NotificationStore)
) =>
  actions$.pipe(
    ofType(SharedActions.sendNotification),
    tap(({ message, withType }) => {
      notificationStore.addMessage(message, withType);
    })
  );

const redirectAfterLogin = (actions$ = inject(Actions)) =>
  actions$.pipe(
    ofType(SharedActions.setActiveAccountAndRedirect),
    map(() => NavigationActions.toUserDashboard())
  );

const redirectAfterLogout = (actions$ = inject(Actions)) =>
  actions$.pipe(
    ofType(SharedActions.logout),
    map(() => NavigationActions.toHome())
  );

const errorMessageEmptyPreviewlyToken = (
  actions$ = inject(Actions),
  notificationStore = inject(NotificationStore)
) =>
  actions$.pipe(
    ofType(SharedActions.dispatchEmptyPreviewlyTokenError),
    tap(() => notificationStore.addMessage('Previewly token is empty', 'error'))
  );

const doLogout = (
  actions$ = inject(Actions),
  authService = inject(NewAuthService)
) =>
  actions$.pipe(
    ofType(SharedActions.logout),
    tap(() => authService.logout())
  );

const dispatchTaskForLoadingImages = (actions$ = inject(Actions)) =>
  actions$.pipe(
    ofType(SharedActions.dispatchLoadingImages),
    map(({ ids }) =>
      TaskActions.createTask({
        task: ImagesTaskExecutorFactory.createTaskProps(
          ids,
          environment.services.previewly.token
        ),
      })
    )
  );

const shouldLoginRedirect = (actions$ = inject(Actions)) =>
  actions$.pipe(
    ofType(SharedActions.shouldLogin),
    map(() => NavigationActions.toLogin())
  );

export const sharedEffects = {
  init: createEffect(init, StoreDispatchEffect),
  shouldLoginRedirect: createEffect(shouldLoginRedirect, StoreDispatchEffect),
  logout: createEffect(doLogout, StoreUnDispatchEffect),

  redirectAfterLogin: createEffect(redirectAfterLogin, StoreDispatchEffect),
  redirectAfterLogout: createEffect(redirectAfterLogout, StoreDispatchEffect),

  errorMessageEmptyPreviewlyToken: createEffect(
    errorMessageEmptyPreviewlyToken,
    StoreUnDispatchEffect
  ),
  sendNotification: createEffect(sendNotification, StoreUnDispatchEffect),

  dispatchTaskForLoadingImages: createEffect(
    dispatchTaskForLoadingImages,
    StoreDispatchEffect
  ),
};
