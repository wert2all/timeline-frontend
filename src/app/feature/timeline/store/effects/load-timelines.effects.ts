import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, of } from 'rxjs';
import { ApiClient } from '../../../../api/internal/graphql';
import { StoreDispatchEffect } from '../../../../app.types';
import {
  apiAssertNotNull,
  extractApiData,
} from '../../../../libs/api.functions';
import { SharedActions } from '../../../../shared/store/shared/shared.actions';
import { LoadTimelinesActions } from '../actions/load-timelines.actions';

export const loadTimelinesEffects = {
  loadTimelineProps: createEffect(
    (actions$ = inject(Actions), api = inject(ApiClient)) => {
      return actions$.pipe(
        ofType(LoadTimelinesActions.loadTimeline),
        exhaustMap(({ timelineId }) => {
          return api
            .getTimeline({ timelineId: timelineId })
            .pipe(
              map(result =>
                apiAssertNotNull(
                  extractApiData(result)?.timeline,
                  'Cannot load timeline'
                )
              )
            );
        }),
        map(timeline => LoadTimelinesActions.successLoadTimeline({ timeline })),
        catchError(error =>
          of(LoadTimelinesActions.errorLoadTimeline({ error }))
        )
      );
    },
    StoreDispatchEffect
  ),

  errorLoadingTimeline: createEffect((actions$ = inject(Actions)) => {
    return actions$.pipe(
      ofType(LoadTimelinesActions.errorLoadTimeline),
      map(({ error }) =>
        SharedActions.sendNotification({
          message: error.message,
          withType: 'error',
        })
      )
    );
  }, StoreDispatchEffect),

  loadTimelines: createEffect(
    (actions$ = inject(Actions), api = inject(ApiClient)) => {
      return actions$.pipe(
        ofType(LoadTimelinesActions.loadAccountTimelines),
        exhaustMap(({ accountId }) =>
          api.getAccountTimelines({ accountId }).pipe(
            map(result =>
              apiAssertNotNull(
                extractApiData(result)?.timelines,
                'Empty timelines'
              ).map(timeline => ({ ...timeline, accountId }))
            ),
            map(timelines =>
              LoadTimelinesActions.successLoadAccountTimelines({
                timelines,
                accountId,
              })
            ),
            catchError(error =>
              of(
                SharedActions.sendNotification({
                  message: error,
                  withType: 'error',
                })
              )
            )
          )
        )
      );
    },
    StoreDispatchEffect
  ),
};
