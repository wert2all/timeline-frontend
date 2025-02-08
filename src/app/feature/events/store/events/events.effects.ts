import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, of } from 'rxjs';
import { ApiClient, Status } from '../../../../api/internal/graphql';
import { StoreDispatchEffect } from '../../../../app.types';
import { SharedActions } from '../../../../shared/store/shared/shared.actions';
import { EventActions } from './events.actions';
import { fromEditableEventStateToApiInput } from './events.convertors';

const deleteEvent = (actions$ = inject(Actions), api = inject(ApiClient)) => {
  return actions$.pipe(
    ofType(EventActions.deleteEvent),
    exhaustMap(({ eventId }) =>
      api.deleteEvent({ eventId: eventId }).pipe(
        map(result => result.data?.deleteEvent || null),
        map(result =>
          result === Status.success
            ? EventActions.successDeleteEvent({ eventId: eventId })
            : EventActions.failedDeleteEvent({ eventId: eventId })
        ),
        catchError(() =>
          of(EventActions.failedDeleteEvent({ eventId: eventId }))
        )
      )
    )
  );
};

const failedDeleteEvent = (action$ = inject(Actions)) =>
  action$.pipe(
    ofType(EventActions.failedDeleteEvent),
    map(() =>
      SharedActions.sendNotification({
        message: 'Could not delete event',
        withType: 'error',
      })
    )
  );

const saveEditableEvent = (actions$ = inject(Actions)) =>
  actions$.pipe(
    ofType(EventActions.saveEditableEvent),
    map(({ event }) => fromEditableEventStateToApiInput(event)),
    map(event =>
      event.id
        ? EventActions.updateExistEventOnAPI({
            event: { ...event, id: event.id },
          })
        : EventActions.pushNewEventToAPI({ event: event })
    )
  );

const apiException = (action$ = inject(Actions)) =>
  action$.pipe(
    ofType(EventActions.apiException),
    map(() =>
      SharedActions.sendNotification({
        message: 'Something went wrong. Try again later',
        withType: 'error',
      })
    )
  );

export const eventsEffects = {
  deleteEvent: createEffect(deleteEvent, StoreDispatchEffect),
  failedDeleteEvent: createEffect(failedDeleteEvent, StoreDispatchEffect),

  saveEditableEvent: createEffect(saveEditableEvent, StoreDispatchEffect),

  apiException: createEffect(apiException, StoreDispatchEffect),
};
