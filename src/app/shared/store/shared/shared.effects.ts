import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { StoreDispatchEffect, StoreUnDispatchEffect } from '../../../app.types';
import { NewAuthService } from '../../../feature/auth/shared/auth.service';
import { ImagesTaskExecutorFactory } from '../../../feature/task/executors/images.factory';
import { NotificationStore } from '../../../feature/ui/layout/store/notification/notifications.store';
import { NavigationBuilder } from '../../services/navigation/navigation.builder';
import { TaskActions } from '../../task/task.actions';
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

const redirectAfterLogout = (
  actions$ = inject(Actions),
  navigationBulder = inject(NavigationBuilder)
) =>
  actions$.pipe(
    ofType(SharedActions.logout),
    map(() =>
      SharedActions.navigate({
        destination: navigationBulder.forUser().home(),
      })
    )
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

const shouldLoginRedirect = (
  actions$ = inject(Actions),
  navigationBulder = inject(NavigationBuilder)
) =>
  actions$.pipe(
    ofType(SharedActions.shouldLogin),
    map(() =>
      SharedActions.navigate({
        destination: navigationBulder.forUser().login(),
      })
    )
  );

const navigate = (actions$ = inject(Actions), router = inject(Router)) =>
  actions$.pipe(
    ofType(SharedActions.navigate),
    tap(({ destination }) => {
      router.navigate([destination.toString()]);
    })
  );

const navigateToUrl = (actions$ = inject(Actions), router = inject(Router)) =>
  actions$.pipe(
    ofType(SharedActions.navigateToURL),
    tap(({ url }) => {
      router.navigate([url]);
    })
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
  navigate: createEffect(navigate, StoreUnDispatchEffect),
  navigateToUrl: createEffect(navigateToUrl, StoreUnDispatchEffect),
};
