import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { StoreDispatchEffect, StoreUnDispatchEffect } from '../../../app.types';
import { NewAuthService } from '../../../feature/auth/shared/auth.service';
import { ImagesTaskExecutorFactory } from '../../../feature/task/executors/images.factory';
import { NotificationStore } from '../../../feature/ui/layout/store/notification/notifications.store';
import { TaskActions } from '../../task/task.actions';
import { NavigationActions } from '../navigation/navigation.actions';
import { SharedActions } from './shared.actions';

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

export const sharedEffects = {
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
};
