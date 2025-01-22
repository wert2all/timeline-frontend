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
import { TimelineActions } from './timeline.actions';

const setActiveTimeline = (action$ = inject(Actions)) =>
  action$.pipe(
    ofType(
      TimelineActions.successAddTimeline,
      TimelineActions.successLoadAccountTimelines
    ),
    map(({ timelines, accountId }) => ({
      timeline: timelines.length > 0 ? timelines[0] || null : null,
      accountId: accountId,
    })),
    map(options =>
      options.timeline
        ? TimelineActions.setActiveTimeline({
            timeline: options.timeline,
            accountId: options.accountId,
          })
        : TimelineActions.shouldNotSetActiveTimeline()
    )
  );

const addTimeline = (action$ = inject(Actions), api = inject(ApiClient)) =>
  action$.pipe(
    ofType(TimelineActions.addTimeline),
    exhaustMap(({ name, accountId }) =>
      api.addTimelineMutation({ timeline: { name, accountId } }).pipe(
        map(result => result.data?.timeline || null),
        map(timeline =>
          timeline
            ? TimelineActions.successAddTimeline({
                accountId,
                timelines: [{ id: timeline.id, name: timeline.name || '' }],
              })
            : TimelineActions.emptyTimeline()
        ),
        catchError(exception =>
          of(TimelineActions.apiException({ exception: exception }))
        )
      )
    )
  );

const emptyProfile = (action$ = inject(Actions)) =>
  action$.pipe(
    ofType(TimelineActions.emptyTimeline),
    map(() =>
      SharedActions.sendNotification({
        message: 'Cannot add timeline',
        withType: 'error',
      })
    )
  );

const apiException = (action$ = inject(Actions)) =>
  action$.pipe(
    ofType(TimelineActions.apiException),
    map(() =>
      SharedActions.sendNotification({
        message: 'Something went wrong. Try again later',
        withType: 'error',
      })
    )
  );

const loadTimelines = (actions$ = inject(Actions), api = inject(ApiClient)) =>
  actions$.pipe(
    ofType(TimelineActions.loadAccountTimelines),
    exhaustMap(({ accountId }) =>
      api.getAccountTimelines({ accountId }).pipe(
        map(result =>
          apiAssertNotNull(
            extractApiData(result)?.timelines,
            'Empty timelines'
          ).map(timeline => ({ id: timeline.id, name: timeline.name || '' }))
        ),
        map(timelines =>
          TimelineActions.successLoadAccountTimelines({ timelines, accountId })
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
  addTimeline: createEffect(addTimeline, StoreDispatchEffect),

  setActiveTimeline: createEffect(setActiveTimeline, StoreDispatchEffect),
  emptyProfile: createEffect(emptyProfile, StoreDispatchEffect),
  apiException: createEffect(apiException, StoreDispatchEffect),
};
