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
import { TimelinePropsActions } from '../actions/timeline-props.actions';

export const timelinePropsEffects = {
  loadTimelineProps: createEffect(
    (actions$ = inject(Actions), api = inject(ApiClient)) => {
      return actions$.pipe(
        ofType(TimelinePropsActions.loadTimeline),
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
        map(timeline => TimelinePropsActions.successLoadTimeline({ timeline })),
        catchError(error =>
          of(TimelinePropsActions.errorLoadTimeline({ error }))
        )
      );
    },
    StoreDispatchEffect
  ),

  errorLoadingTimeline: createEffect((actions$ = inject(Actions)) => {
    return actions$.pipe(
      ofType(TimelinePropsActions.errorLoadTimeline),
      map(({ error }) =>
        SharedActions.sendNotification({
          message: error.message,
          withType: 'error',
        })
      )
    );
  }, StoreDispatchEffect),
};
