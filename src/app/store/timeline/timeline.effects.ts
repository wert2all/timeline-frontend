import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, of, tap } from 'rxjs';
import { ApiClient } from '../../api/internal/graphql';
import { StoreDispatchEffect, StoreUnDispatchEffect } from '../../app.types';
import { apiAssertNotNull, extractApiData } from '../../libs/api.functions';
import { NotificationStore } from '../notifications/notifications.store';
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

const emptyProfile = (
  action$ = inject(Actions),
  notification = inject(NotificationStore)
) =>
  action$.pipe(
    ofType(TimelineActions.emptyTimeline),
    tap(() => notification.addMessage('Cannot add timeline', 'error'))
  );

const apiException = (
  action$ = inject(Actions),
  notification = inject(NotificationStore)
) =>
  action$.pipe(
    ofType(TimelineActions.apiException),
    tap(() =>
      notification.addMessage('Something went wrong. Try again later', 'error')
    )
  );

const loadTimelines = (
  actions$ = inject(Actions),
  api = inject(ApiClient),
  notification = inject(NotificationStore)
) =>
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
        catchError(error => {
          notification.addMessage(error, 'error');
          return of(TimelineActions.emptyTimelines);
        })
      )
    )
  );

export const timelineEffects = {
  loadAccountTimelines: createEffect(loadTimelines, StoreDispatchEffect),
  addTimeline: createEffect(addTimeline, StoreDispatchEffect),

  setActiveTimeline: createEffect(setActiveTimeline, StoreDispatchEffect),
  emptyProfile: createEffect(emptyProfile, StoreUnDispatchEffect),
  apiException: createEffect(apiException, StoreUnDispatchEffect),
};
