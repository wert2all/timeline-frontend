import { inject } from '@angular/core';
import {
  Actions,
  ROOT_EFFECTS_INIT,
  createEffect,
  ofType,
} from '@ngrx/effects';
import { catchError, exhaustMap, map, of, tap } from 'rxjs';
import { StoreDispatchEffect, StoreUnDispatchEffect } from '../../../app.types';
import { CurrentAccountService } from '../../../feature/non-authorized/user/shared/current-account.service';
import { NotificationStore } from '../../../feature/ui/layout/store/notification/notifications.store';
import { SharedAuthTokenService } from '../../services/auth-token.service';
import { NavigationActions } from '../navigation/navigation.actions';
import { SharedActions } from './shared.actions';

const init = (
  actions$ = inject(Actions),
  tokenService = inject(SharedAuthTokenService),
  currentAccountService = inject(CurrentAccountService)
) =>
  actions$.pipe(
    ofType(ROOT_EFFECTS_INIT),
    exhaustMap(() =>
      tokenService.token ? currentAccountService.getAccount() : of(null)
    ),
    map(account =>
      account
        ? SharedActions.setActiveAccount({ account })
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
    ofType(SharedActions.setActiveAccountOnRedirect),
    map(() => NavigationActions.toUserDashboard())
  );

export const sharedEffects = {
  init: createEffect(init, StoreDispatchEffect),
  redirectAfterLogin: createEffect(redirectAfterLogin, StoreDispatchEffect),
  sendNotification: createEffect(sendNotification, StoreUnDispatchEffect),
};
