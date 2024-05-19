import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { catchError, exhaustMap, filter, map, of, tap, zip } from 'rxjs';
import {
  ApiClient,
  Status,
  TimelineEventInput,
} from '../../api/internal/graphql';
import { StoreDispatchEffect, StoreUnDispatchEffect } from '../../app.types';
import { AuthActions } from '../auth/auth.actions';
import { NotificationStore } from '../notifications/notifications.store';
import { EventActions, TimelineActions } from './timeline.actions';
import { fromApiEventToState } from './timeline.convertors';
import { timelineFeature } from './timeline.reducer';

const setActiveTimeline = (action$ = inject(Actions)) =>
  action$.pipe(
    ofType(
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

const addTimelineAfterLogin = (action$ = inject(Actions)) =>
  action$.pipe(
    ofType(TimelineActions.addTimelineAfterLogin),
    map(() => AuthActions.promptLogin())
  );

const loginSuccessAddTimeline = (action$ = inject(Actions)) =>
  zip(action$.pipe(ofType(TimelineActions.addTimelineAfterLogin)))
    .pipe(map(result => result[0].name))
    .pipe(map(name => TimelineActions.addTimeline({ name: name })));

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
    ofType(TimelineActions.apiException, EventActions.apiException),
    tap(() =>
      notification.addMessage('Something went wrong. Try again later', 'error')
    )
  );

const addEvent = (actions$ = inject(Actions), store = inject(Store)) =>
  actions$.pipe(
    ofType(EventActions.addEvent),
    concatLatestFrom(() => store.select(timelineFeature.selectEventForPush)),
    map(([, event]) => event),
    filter(preview => !!preview),
    map(preview => preview as TimelineEventInput),
    map(preview => EventActions.pushEventToAPI({ event: preview }))
  );

const dissmissAddForm = (actions$ = inject(Actions)) =>
  actions$.pipe(
    ofType(EventActions.pushEventToAPI),
    map(EventActions.cleanPreviewAfterPushEvent)
  );

const pushEventToApi = (action$ = inject(Actions), api = inject(ApiClient)) =>
  action$.pipe(
    ofType(EventActions.pushEventToAPI),
    exhaustMap(({ event }) =>
      api.addTimelineEvent({ event: event }).pipe(
        map(result => result.data?.event || null),
        map(event =>
          event
            ? EventActions.successPushEvent({
                addedEvent: fromApiEventToState(event),
              })
            : EventActions.emptyEvent()
        ),
        catchError(exception =>
          of(EventActions.apiException({ exception: exception }))
        )
      )
    )
  );

const afterSetActiveTimeline = (action$ = inject(Actions)) =>
  action$.pipe(
    ofType(TimelineActions.setActiveTimelineAfterAuthorize),
    map(({ timeline }) => timeline?.id || null),
    filter(id => !!id),
    map(id => id as number),
    map(id => EventActions.loadActiveTimelineEvents({ timelineId: id }))
  );

const loadActiveTimelineEvents = (
  action$ = inject(Actions),
  api = inject(ApiClient)
) =>
  action$.pipe(
    ofType(EventActions.loadActiveTimelineEvents),
    exhaustMap(({ timelineId }) =>
      api.getEvents({ timelineId: timelineId }).pipe(
        map(result => result.data.events || []),
        map(events =>
          EventActions.successLoadActiveTimelineEvents({
            events: events.map(event => fromApiEventToState(event)),
          })
        ),
        catchError(exception =>
          of(EventActions.apiException({ exception: exception }))
        )
      )
    )
  );

const deleteEvent = (actions$ = inject(Actions), api = inject(ApiClient)) => {
  return actions$.pipe(
    ofType(EventActions.deleteEvent),
    exhaustMap(({ eventId }) =>
      api.deleteEvent({ eventId: eventId }).pipe(
        map(result => result.data?.deleteEvent || null),
        map(result =>
          result === Status.success
            ? EventActions.successDeleteEvent({ eventId: eventId })
            : EventActions.failedDeleteEvent({ eventId: eventId })
        ),
        catchError(() =>
          of(EventActions.failedDeleteEvent({ eventId: eventId }))
        )
      )
    )
  );
};

const failedDeleteEvent = (
  action$ = inject(Actions),
  notification = inject(NotificationStore)
) =>
  action$.pipe(
    ofType(EventActions.failedDeleteEvent),
    tap(() => notification.addMessage('Could not delete event', 'error'))
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
  setActiveTimeline: createEffect(setActiveTimeline, StoreDispatchEffect),

  emptyProfile: createEffect(emptyProfile, StoreUnDispatchEffect),
  apiException: createEffect(apiException, StoreUnDispatchEffect),
};

const setTimelinesAfterAuthorize = (actions$ = inject(Actions)) =>
  actions$.pipe(
    ofType(AuthActions.successLoadUserAfterInit, AuthActions.successLoadUser),
    map(({ user }) => user.timelines.find(Boolean) || null),
    map(timeline =>
      timeline ? { ...timeline, name: timeline.name || null } : null
    ),
    map(timeline =>
      TimelineActions.setActiveTimelineAfterAuthorize({ timeline })
    )
  );

export const eventsEffects = {
  addEvent: createEffect(addEvent, StoreDispatchEffect),
  pushEventToApi: createEffect(pushEventToApi, StoreDispatchEffect),
  dissmissAddForm: createEffect(dissmissAddForm, StoreDispatchEffect),

  setTimelinesAfterAuthorize: createEffect(
    setTimelinesAfterAuthorize,
    StoreDispatchEffect
  ),

  afterSetActiveTimeline: createEffect(
    afterSetActiveTimeline,
    StoreDispatchEffect
  ),

  deleteEvent: createEffect(deleteEvent, StoreDispatchEffect),
  failedDeleteEvent: createEffect(failedDeleteEvent, StoreUnDispatchEffect),

  loadActiveTimelineEvents: createEffect(
    loadActiveTimelineEvents,
    StoreDispatchEffect
  ),
};
