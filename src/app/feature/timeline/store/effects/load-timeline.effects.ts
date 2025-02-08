import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, of } from 'rxjs';
import { ApiClient } from '../../../../api/internal/graphql';
import { StoreDispatchEffect } from '../../../../app.types';
import {
  apiAssertNotNull,
  extractApiData,
} from '../../../../libs/api.functions';
import { TimelineActions } from '../timeline.actions';

export const loadTimelineEffects = {
  loadTimelineEvents: createEffect(
    (actions$ = inject(Actions), api = inject(ApiClient)) => {
      return actions$.pipe(
        ofType(TimelineActions.loadTimelineEvents),
        exhaustMap(options =>
          api
            .getEvents(options)
            .pipe(
              map(result =>
                apiAssertNotNull(
                  extractApiData(result)?.events,
                  'Could not load timeline'
                )
              )
            )
        ),
        map(() => TimelineActions.successLoadTimeline()),
        catchError(error =>
          of(TimelineActions.errorLoadingTimelineEvent({ error }))
        )
      );
    },
    StoreDispatchEffect
  ),
};
