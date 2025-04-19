import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, of } from 'rxjs';
import { ApiClient } from '../../../../../api/internal/graphql';
import { StoreDispatchEffect } from '../../../../../app.types';
import {
  apiAssertNotNull,
  extractApiData,
} from '../../../../../libs/api.functions';
import { SharedActions } from '../../../../../shared/store/shared/shared.actions';
import { LoadTimelinesActions } from '../../../../timeline/store/actions/load-timelines.actions';

const loadTimelines = (actions$ = inject(Actions), api = inject(ApiClient)) =>
  actions$.pipe(
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

export const timelineEffects = {
  loadAccountTimelines: createEffect(loadTimelines, StoreDispatchEffect),
};
