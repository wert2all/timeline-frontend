import { inject } from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { catchError, exhaustMap, map, of, tap } from 'rxjs';
import { ApiClient } from '../../../../../api/internal/graphql';
import { ErrorHandler } from '../../../../../shared/handlers/error.handler';
import { ErrorMessage } from '../../../../../shared/handlers/error.types';
import { NavigationBuilder } from '../../../../../shared/services/navigation/navigation.builder';
import { SharedActions } from '../../../../../shared/store/shared/shared.actions';
import { sharedFeature } from '../../../../../shared/store/shared/shared.reducers';
import { AddTimelineActions } from '../actions/add-timeline.actions';

export const addTimeline = (
  action$ = inject(Actions),
  api = inject(ApiClient),
  store = inject(Store)
) => {
  return action$.pipe(
    ofType(AddTimelineActions.addTimeline),
    concatLatestFrom(() => store.select(sharedFeature.selectActiveAccountId)),
    map(([{ name }, accountId]) => {
      if (!accountId) {
        throw new Error('Could not add timeline.');
      }

      return { name: name, accountId };
    }),
    exhaustMap(({ name, accountId }) =>
      api.addTimelineMutation({ timeline: { name, accountId } }).pipe(
        map(result => result.data?.timeline || null),
        map(timeline =>
          timeline
            ? AddTimelineActions.successAddTimeline({
                accountId: timeline.accountId,
                timelines: [
                  {
                    id: timeline.id,
                    name: timeline.name || '',
                    accountId: timeline.accountId,
                  },
                ],
              })
            : AddTimelineActions.failedAddTimeline({
                error: 'Something went wrong: API returns an empty timeline.',
              })
        ),
        catchError(exception =>
          of(
            AddTimelineActions.failedAddTimeline({
              error: exception.message,
            })
          )
        )
      )
    )
  );
};
export const failedAddTimeline = (
  action$ = inject(Actions),
  errorHandler = inject(ErrorHandler)
) => {
  return action$.pipe(
    ofType(AddTimelineActions.failedAddTimeline),
    tap(({ error }) =>
      errorHandler.handleError(new ErrorMessage(error, true).loggable().error())
    )
  );
};

export const redirectOnSuccess = (
  action$ = inject(Actions),
  navigationBuilder = inject(NavigationBuilder)
) => {
  return action$.pipe(
    ofType(AddTimelineActions.successAddTimeline),
    map(() =>
      SharedActions.navigate({
        destination: navigationBuilder.forDashboard().index(),
      })
    )
  );
};
