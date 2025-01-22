import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs';
import { StoreUnDispatchEffect } from '../../app.types';
import { NotificationStore } from '../../feature/ui/layout/store/notifications.store';
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

export const sharedEffects = {
  sendNotification: createEffect(sendNotification, StoreUnDispatchEffect),
};
