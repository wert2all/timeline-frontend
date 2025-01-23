import { inject } from '@angular/core';
import {
  Actions,
  ROOT_EFFECTS_INIT,
  createEffect,
  ofType,
} from '@ngrx/effects';
import { map, tap } from 'rxjs';
import { StoreDispatchEffect, StoreUnDispatchEffect } from '../../../app.types';
import { AuthService } from '../../../feature/auth/auth.service';
import { NotificationStore } from '../../../feature/ui/layout/store/notification/notifications.store';
import { NavigationActions } from '../navigation/navigation.actions';
import { SharedActions } from './shared.actions';

const init = (actions$ = inject(Actions), authService = inject(AuthService)) =>
  actions$.pipe(
    ofType(ROOT_EFFECTS_INIT),
    tap(() => authService.trySetActiveAccount())
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

export const sharedEffects = {
  init: createEffect(init, StoreUnDispatchEffect),
  redirectAfterLogin: createEffect(redirectAfterLogin, StoreDispatchEffect),
  redirectAfterLogout: createEffect(redirectAfterLogout, StoreDispatchEffect),

  errorMessageEmptyPreviewlyToken: createEffect(
    errorMessageEmptyPreviewlyToken,
    StoreUnDispatchEffect
  ),
  sendNotification: createEffect(sendNotification, StoreUnDispatchEffect),
};
