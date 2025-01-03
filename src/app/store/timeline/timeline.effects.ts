import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { catchError, exhaustMap, filter, map, of, tap } from 'rxjs';
import { ApiClient, Status } from '../../api/internal/graphql';
import { StoreDispatchEffect, StoreUnDispatchEffect } from '../../app.types';
import { apiAssertNotNull, extractApiData } from '../../libs/api.functions';
import { AccountActions } from '../account/account.actions';
import { NotificationStore } from '../notifications/notifications.store';
import { EventActions, TimelineActions } from './timeline.actions';
import {
  fromApiEventToState,
  fromEditableEventStateToApiInput,
} from './timeline.convertors';
import { timelineFeature } from './timeline.reducer';

const loadTimelines = (actions$ = inject(Actions), api = inject(ApiClient)) =>
  actions$.pipe(
    ofType(AccountActions.setAccount),
    exhaustMap(({ account }) =>
      api.getAccountTimelines({ accountId: account.id }).pipe(
        map(result => extractApiData(result)),
        map(data =>
          TimelineActions.setActiveTimelineAfterAuthorize({
            timeline: data?.timelines[0]
              ? { name: data.timelines[0].name || '', id: data.timelines[0].id }
              : null,
          })
        )
      )
    ),
    catchError(err => of(TimelineActions.apiException({ exception: err })))
  );

const setActiveTimeline = (action$ = inject(Actions)) =>
  action$.pipe(
    ofType(TimelineActions.successAddTimeline),
    map(({ timelines }) =>
      timelines.length > 0 ? timelines[0] || null : null
    ),
    map(timeline =>
      TimelineActions.setActiveTimelineAfterAuthorize({ timeline })
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
    ofType(TimelineActions.apiException, EventActions.apiException),
    tap(() =>
      notification.addMessage('Something went wrong. Try again later', 'error')
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
            events: events.map(event => fromApiEventToState(event, timelineId)),
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
  setActiveTimeline: createEffect(setActiveTimeline, StoreDispatchEffect),

  emptyProfile: createEffect(emptyProfile, StoreUnDispatchEffect),
  apiException: createEffect(apiException, StoreUnDispatchEffect),
};

const saveEditableEvent = (actions$ = inject(Actions), store = inject(Store)) =>
  actions$.pipe(
    ofType(EventActions.saveEditableEvent),
    concatLatestFrom(() => store.select(timelineFeature.selectEditEvent)),
    map(([, editEvent]) => editEvent?.event),
    map(event => (event ? fromEditableEventStateToApiInput(event) : null)),
    map(event =>
      event
        ? event.id
          ? EventActions.updateExistEventOnAPI({
              event: { ...event, id: event.id },
            })
          : EventActions.pushNewEventToAPI({ event: event })
        : EventActions.nothingToSave()
    )
  );

const pushNewEventToApi = (
  actions$ = inject(Actions),
  api = inject(ApiClient),
  notification = inject(NotificationStore)
) =>
  actions$.pipe(
    ofType(EventActions.pushNewEventToAPI),
    exhaustMap(({ event }) =>
      api.addTimelineEvent({ event: event }).pipe(
        map(result => apiAssertNotNull(extractApiData(result), 'Empty event')),
        map(data => fromApiEventToState(data.event, event.timelineId)),
        map(event => EventActions.successPushNewEvent({ event })),
        catchError(error => {
          notification.addMessage(error, 'error');
          return of(EventActions.emptyEvent);
        })
      )
    )
  );

const pushExistEventToApi = (
  actions$ = inject(Actions),
  api = inject(ApiClient),
  notification = inject(NotificationStore)
) =>
  actions$.pipe(
    ofType(EventActions.updateExistEventOnAPI),
    exhaustMap(({ event }) =>
      api.saveExistTimelineEvent({ event: event }).pipe(
        map(result => apiAssertNotNull(extractApiData(result), 'Empty event')),
        map(data => fromApiEventToState(data.event, event.timelineId)),
        map(event => EventActions.successUpdateEvent({ event })),
        catchError(error => {
          notification.addMessage(error, 'error');
          return of(EventActions.emptyEvent);
        })
      )
    )
  );

export const eventsEffects = {
  loadTimelines: createEffect(loadTimelines, StoreDispatchEffect),

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

  saveEditableEvent: createEffect(saveEditableEvent, StoreDispatchEffect),

  pushNewEventToApi: createEffect(pushNewEventToApi, StoreDispatchEffect),
  pushExistEventToApi: createEffect(pushExistEventToApi, StoreDispatchEffect),
};
