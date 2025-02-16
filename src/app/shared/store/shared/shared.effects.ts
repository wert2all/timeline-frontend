import { inject } from '@angular/core';
import {
  Actions,
  ROOT_EFFECTS_INIT,
  createEffect,
  ofType,
} from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { catchError, map, of, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { StoreDispatchEffect, StoreUnDispatchEffect } from '../../../app.types';
import { CurrentAccountProvider } from '../../../feature/account/current.provider';
import { AccountActions } from '../../../feature/account/store/account.actions';
import { accountFeature } from '../../../feature/account/store/account.reducer';
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
  currentAccountIdProvider = inject(CurrentAccountProvider),
  store = inject(Store)
) =>
  actions$.pipe(
    ofType(ROOT_EFFECTS_INIT),
    map(() => tokenProvider.getToken()),
    concatLatestFrom(() => store.select(accountFeature.selectAccounts)),
    map(([token, accounts]) => {
      const currentAccountId = currentAccountIdProvider.getActiveAccountId();

      return {
        account:
          token && currentAccountId
            ? accounts.find(a => a.id === currentAccountId)
            : null,
        accounts: token ? accounts : [],
      };
    }),
    map(({ account, accounts }) =>
      account && accounts.length > 0
        ? AccountActions.setActiveAccountAfterInit({ account, accounts })
        : AccountActions.emptyActiveAccount()
    ),
    catchError(err => of(AccountActions.errorOnInitAuth({ error: err })))
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

const setActiveAccountAfterAuth = (
  actions$ = inject(Actions),
  currentAccountProvider = inject(CurrentAccountProvider)
) =>
  actions$.pipe(
    ofType(SharedActions.successAuthenticated),
    map(({ accounts }) => ({
      currentId: currentAccountProvider.getActiveAccountId(),
      accounts,
    })),
    map(({ currentId, accounts }) => ({
      currentId: currentId ? currentId : accounts.slice(0, 1)[0],
      accounts,
    })),
    map(({ currentId, accounts }) =>
      accounts.find(account => account.id === currentId)
    ),
    map(current =>
      current
        ? AccountActions.setActiveAccountAfterAuth({ account: current })
        : AccountActions.emptyCurrentAccount()
    )
  );

export const sharedEffects = {
  init: createEffect(init, StoreDispatchEffect),
  shouldLoginRedirect: createEffect(shouldLoginRedirect, StoreDispatchEffect),
  logout: createEffect(doLogout, StoreUnDispatchEffect),

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

  setActiveAccountAfterAuth: createEffect(
    setActiveAccountAfterAuth,
    StoreDispatchEffect
  ),
};
