import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, of, tap } from 'rxjs';
import { ApiClient, Status } from '../../../../api/internal/graphql';
import {
  StoreDispatchEffect,
  StoreUnDispatchEffect,
} from '../../../../app.types';
import { ErrorHandler } from '../../../../shared/handlers/error.handler';
import { ErrorMessage } from '../../../../shared/handlers/error.types';
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

  failedDeleteEvent: createEffect(
    (action$ = inject(Actions), errorHandler = inject(ErrorHandler)) => {
      return action$.pipe(
        ofType(DeleteEventActions.failedDeleteEvent),
        tap(() =>
          errorHandler.handle(
            new ErrorMessage('Could not delete event', true, true).error()
          )
        )
      );
    },
    StoreUnDispatchEffect
  ),
};
