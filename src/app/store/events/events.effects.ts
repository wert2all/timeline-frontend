import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, of, tap } from 'rxjs';
import { ApiClient, Status } from '../../api/internal/graphql';
import { StoreDispatchEffect, StoreUnDispatchEffect } from '../../app.types';
import { apiAssertNotNull, extractApiData } from '../../libs/api.functions';
import { NotificationStore } from '../notifications/notifications.store';
import { TimelineActions } from '../timeline/timeline.actions';
import { EventActions } from './events.actions';
import {
  fromApiEventToState,
  fromEditableEventStateToApiInput,
} from './events.convertors';

const dispatchLoadEventsAfterSetActiveTimeline = (actions$ = inject(Actions)) =>
  actions$.pipe(
    ofType(TimelineActions.setActiveTimeline),
    map(({ timeline }) =>
      EventActions.loadTimelineEvents({ timelineId: timeline.id })
    )
  );

const loadActiveTimelineEvents = (
  action$ = inject(Actions),
  api = inject(ApiClient)
) =>
  action$.pipe(
    ofType(EventActions.loadTimelineEvents),
    exhaustMap(({ timelineId }) =>
      api.getEvents({ timelineId: timelineId }).pipe(
        map(result => result.data.events || []),
        map(events =>
          EventActions.successLoadTimelineEvents({
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

const saveEditableEvent = (actions$ = inject(Actions)) =>
  actions$.pipe(
    ofType(EventActions.saveEditableEvent),
    map(({ event }) => fromEditableEventStateToApiInput(event)),
    tap(event => console.log(event.date)),
    map(event =>
      event.id
        ? EventActions.updateExistEventOnAPI({
            event: { ...event, id: event.id },
          })
        : EventActions.pushNewEventToAPI({ event: event })
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
        map(event => EventActions.successPushNewEvent({ events: [event] })),
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
        map(event => EventActions.successUpdateEvent({ events: [event] })),
        catchError(error => {
          notification.addMessage(error, 'error');
          return of(EventActions.emptyEvent);
        })
      )
    )
  );
const apiException = (
  action$ = inject(Actions),
  notification = inject(NotificationStore)
) =>
  action$.pipe(
    ofType(EventActions.apiException),
    tap(() =>
      notification.addMessage('Something went wrong. Try again later', 'error')
    )
  );

export const eventsEffects = {
  deleteEvent: createEffect(deleteEvent, StoreDispatchEffect),
  failedDeleteEvent: createEffect(failedDeleteEvent, StoreUnDispatchEffect),

  loadActiveTimelineEvents: createEffect(
    loadActiveTimelineEvents,
    StoreDispatchEffect
  ),

  dispatchLoadEventsAfterSetActiveTimeline: createEffect(
    dispatchLoadEventsAfterSetActiveTimeline,
    StoreDispatchEffect
  ),
  saveEditableEvent: createEffect(saveEditableEvent, StoreDispatchEffect),

  pushNewEventToApi: createEffect(pushNewEventToApi, StoreDispatchEffect),
  pushExistEventToApi: createEffect(pushExistEventToApi, StoreDispatchEffect),
  apiException: createEffect(apiException, StoreUnDispatchEffect),
};
