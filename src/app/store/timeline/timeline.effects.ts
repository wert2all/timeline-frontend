import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, of, tap, zip } from 'rxjs';
import { ApiClient } from '../../api/internal/graphql';
import { StoreDispatchEffect, StoreUnDispatchEffect } from '../../app.types';
import { AuthActions } from '../auth/auth.actions';
import { NotificationStore } from '../notifications/notifications.store';
import { TimelineActions } from './timeline.actions';

const updateTimelines = (action$ = inject(Actions)) =>
  action$.pipe(
    ofType(AuthActions.loadUserSuccess),
    map(({ user }) =>
      user.timelines.map(timeline => ({
        id: timeline.id,
        name: timeline.name || null,
      }))
    ),
    map(timelines =>
      TimelineActions.updateTimelinesAfterAuthorize({ timelines: timelines })
    )
  );

const setActiveTimeline = (action$ = inject(Actions)) =>
  action$.pipe(
    ofType(
      TimelineActions.updateTimelinesAfterAuthorize,
      TimelineActions.successAddTimeline,
      TimelineActions.successAddTimelineAfterLogin
    ),
    map(({ timelines }) =>
      timelines.length > 0 ? timelines[0] || null : null
    ),
    map(timeline =>
      TimelineActions.setActiveTimelineAfterAuthorize({ timeline: timeline })
    )
  );

const addTimeline = (action$ = inject(Actions), api = inject(ApiClient)) =>
  action$.pipe(
    ofType(TimelineActions.addTimeline),
    exhaustMap(({ name }) =>
      api.addTimelineMutation({ timeline: { name: name } }).pipe(
        map(result => result.data?.timeline || null),
        map(timeline =>
          timeline
            ? TimelineActions.successAddTimeline({
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

const addTimelineAfterLogin = (action$ = inject(Actions)) => {
  return action$.pipe(
    ofType(TimelineActions.addTimelineAfterLogin),
    map(() => AuthActions.promptLogin())
  );
};

const loginSuccessAddTimeline = (action$ = inject(Actions)) => {
  return zip(
    action$.pipe(ofType(TimelineActions.addTimelineAfterLogin)),
    action$.pipe(ofType(AuthActions.authorized))
  )
    .pipe(map(result => result[0].name))
    .pipe(map(name => TimelineActions.addTimeline({ name: name })));
};

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

export const timelineEffects = {
  addTimeline: createEffect(addTimeline, StoreDispatchEffect),
  addTimelineAfterLogin: createEffect(
    addTimelineAfterLogin,
    StoreDispatchEffect
  ),
  loginSuccessAddTimeline: createEffect(
    loginSuccessAddTimeline,
    StoreDispatchEffect
  ),
  updateTimelines: createEffect(updateTimelines, StoreDispatchEffect),
  setActiveTimeline: createEffect(setActiveTimeline, StoreDispatchEffect),

  emptyProfile: createEffect(emptyProfile, StoreUnDispatchEffect),
  apiException: createEffect(apiException, StoreUnDispatchEffect),
};
