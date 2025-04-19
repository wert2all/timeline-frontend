import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, of } from 'rxjs';
import { ApiClient } from '../../../../api/internal/graphql';
import { StoreDispatchEffect } from '../../../../app.types';
import { SharedActions } from '../../../../shared/store/shared/shared.actions';
import { AddTimelineActions } from '../actions/add-timeline.actions';
import { LoadTimelinesActions } from '../actions/load-timelines.actions';
import { SetActiveTimelineActions } from '../actions/set-active.actions';

export const addTimelineEffects = {
  setActiveTimeline: createEffect(
    (action$ = inject(Actions)) =>
      { return action$.pipe(
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
      ) },
    StoreDispatchEffect
  ),

  addTimeline: createEffect(
    (action$ = inject(Actions), api = inject(ApiClient)) =>
      { return action$.pipe(
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
      ) },
    StoreDispatchEffect
  ),

  emptyProfile: createEffect(
    (action$ = inject(Actions)) =>
      { return action$.pipe(
        ofType(AddTimelineActions.emptyTimeline),
        map(() =>
          SharedActions.sendNotification({
            message: 'Cannot add timeline',
            withType: 'error',
          })
        )
      ) },
    StoreDispatchEffect
  ),

  apiException: createEffect(
    (action$ = inject(Actions)) =>
      { return action$.pipe(
        ofType(AddTimelineActions.apiException),
        map(() =>
          SharedActions.sendNotification({
            message: 'Something went wrong. Try again later',
            withType: 'error',
          })
        )
      ) },
    StoreDispatchEffect
  ),
};
