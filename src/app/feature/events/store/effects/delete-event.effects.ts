import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, of } from 'rxjs';
import { ApiClient, Status } from '../../../../api/internal/graphql';
import { StoreDispatchEffect } from '../../../../app.types';
import { SharedActions } from '../../../../shared/store/shared/shared.actions';
import { DeleteEventActions } from '../actions/delete-event.actions';

export const deleteEventEffects = {
  deleteEvent: createEffect(
    (actions$ = inject(Actions), api = inject(ApiClient)) => {
      return actions$.pipe(
        ofType(DeleteEventActions.deleteEvent),
        exhaustMap(({ eventId }) =>
          api.deleteEvent({ eventId: eventId }).pipe(
            map(result => result.data?.deleteEvent || null),
            map(result =>
              result === Status.success
                ? DeleteEventActions.successDeleteEvent({
                    eventId: eventId,
                  })
                : DeleteEventActions.failedDeleteEvent({ eventId: eventId })
            ),
            catchError(() =>
              of(DeleteEventActions.failedDeleteEvent({ eventId: eventId }))
            )
          )
        )
      );
    },
    StoreDispatchEffect
  ),

  failedDeleteEvent: createEffect((action$ = inject(Actions)) => {
    return action$.pipe(
      ofType(DeleteEventActions.failedDeleteEvent),
      map(() =>
        SharedActions.sendNotification({
          message: 'Could not delete event',
          withType: 'error',
        })
      )
    );
  }, StoreDispatchEffect),
};
