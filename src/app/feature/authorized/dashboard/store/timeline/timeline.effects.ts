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
import { AddTimelineActions } from '../../../../timeline/store/actions/add-timeline.actions';
import { LoadTimelinesActions } from '../../../../timeline/store/actions/load-timelines.actions';
import { SetActiveTimelineActions } from '../../../../timeline/store/actions/set-active.actions';

const setActiveTimeline = (action$ = inject(Actions)) =>
  action$.pipe(
    ofType(
      AddTimelineActions.successAddTimeline,
      LoadTimelinesActions.successLoadAccountTimelines
    ),
    map(({ timelines, accountId }) => ({
      timeline: timelines.length > 0 ? timelines[0] || null : null,
      accountId: accountId,
    })),
    map(options =>
      options.timeline
        ? SetActiveTimelineActions.setActiveTimeline({
          timeline: {
            ...options.timeline,
            name: options.timeline.name || '',
            accountId: options.accountId,
          },
          accountId: options.accountId,
        })
        : SetActiveTimelineActions.shouldNotSetActiveTimeline()
    )
  );

const addTimeline = (action$ = inject(Actions), api = inject(ApiClient)) =>
  action$.pipe(
    ofType(AddTimelineActions.addTimeline),
    exhaustMap(({ name, accountId }) =>
      api.addTimelineMutation({ timeline: { name, accountId } }).pipe(
        map(result => result.data?.timeline || null),
        map(timeline =>
          timeline
            ? AddTimelineActions.successAddTimeline({
              accountId,
              timelines: [
                { id: timeline.id, name: timeline.name || '', accountId },
              ],
            })
            : AddTimelineActions.emptyTimeline()
        ),
        catchError(exception =>
          of(AddTimelineActions.apiException({ exception: exception }))
        )
      )
    )
  );

const emptyProfile = (action$ = inject(Actions)) =>
  action$.pipe(
    ofType(AddTimelineActions.emptyTimeline),
    map(() =>
      SharedActions.sendNotification({
        message: 'Cannot add timeline',
        withType: 'error',
      })
    )
  );

const apiException = (action$ = inject(Actions)) =>
  action$.pipe(
    ofType(AddTimelineActions.apiException),
    map(() =>
      SharedActions.sendNotification({
        message: 'Something went wrong. Try again later',
        withType: 'error',
      })
    )
  );

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
  addTimeline: createEffect(addTimeline, StoreDispatchEffect),

  setActiveTimeline: createEffect(setActiveTimeline, StoreDispatchEffect),
  emptyProfile: createEffect(emptyProfile, StoreDispatchEffect),
  apiException: createEffect(apiException, StoreDispatchEffect),
};
