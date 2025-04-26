import { inject } from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, of, tap } from 'rxjs';
import { ApiClient, Status } from '../../../../../api/internal/graphql';
import { ErrorHandler } from '../../../../../shared/handlers/error.handler';
import { ErrorMessage } from '../../../../../shared/handlers/error.types';
import { DeleteEventActions } from '../actions/delete-event.actions';

export const deleteEvent = (
  actions$ = inject(Actions),
  api = inject(ApiClient)
) =>
  actions$.pipe(
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

export const failedDeleteEvent = (
  action$ = inject(Actions),
  errorHandler = inject(ErrorHandler)
) => {
  return action$.pipe(
    ofType(DeleteEventActions.failedDeleteEvent),
    tap(({ eventId }) =>
      errorHandler.handle(
        new ErrorMessage('Could not delete event #' + eventId)
          .notified()
          .loggable()
          .error()
      )
    )
  );
};
