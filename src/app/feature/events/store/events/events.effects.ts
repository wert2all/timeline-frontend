import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, of } from 'rxjs';
import {
  ApiClient,
  TimelineEvent as GQLTimelineEvent,
  Status,
} from '../../../../api/internal/graphql';
import { StoreDispatchEffect } from '../../../../app.types';
import {
  apiAssertNotNull,
  extractApiData,
} from '../../../../libs/api.functions';
import { SharedActions } from '../../../../shared/store/shared/shared.actions';
import { ExistTimelineEvent } from '../../../timeline/store/timeline.types';
import { EventActions } from './events.actions';
import {
  fromApiTypeToState,
  fromEditableEventStateToApiInput,
} from './events.convertors';

export const fromApiEventToState = (
  event: GQLTimelineEvent,
  timelineId: number
): ExistTimelineEvent => ({
  id: event.id,
  timelineId: timelineId,
  date: new Date(event.date),
  type: fromApiTypeToState(event.type),
  title: event.title || undefined,
  description: event.description || undefined,
  showTime: event.showTime === true,
  url: event.url || undefined,
  loading: false,
  tags: event.tags || [],
  imageId: event.previewlyImageId || undefined,
});

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

const failedDeleteEvent = (action$ = inject(Actions)) =>
  action$.pipe(
    ofType(EventActions.failedDeleteEvent),
    map(() =>
      SharedActions.sendNotification({
        message: 'Could not delete event',
        withType: 'error',
      })
    )
  );

const saveEditableEvent = (actions$ = inject(Actions)) =>
  actions$.pipe(
    ofType(EventActions.saveEditableEvent),
    map(({ event }) => fromEditableEventStateToApiInput(event)),
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
  api = inject(ApiClient)
) =>
  actions$.pipe(
    ofType(EventActions.pushNewEventToAPI),
    exhaustMap(({ event }) =>
      api.addTimelineEvent({ event: event }).pipe(
        map(result => apiAssertNotNull(extractApiData(result), 'Empty event')),
        map(data => fromApiEventToState(data.event, event.timelineId)),
        map(event => EventActions.successPushNewEvent({ event })),
        catchError(error => {
          return of(
            SharedActions.sendNotification({
              message: error,
              withType: 'error',
            })
          );
        })
      )
    )
  );

const pushExistEventToApi = (
  actions$ = inject(Actions),
  api = inject(ApiClient)
) =>
  actions$.pipe(
    ofType(EventActions.updateExistEventOnAPI),
    exhaustMap(({ event }) =>
      api.saveExistTimelineEvent({ event: event }).pipe(
        map(result => apiAssertNotNull(extractApiData(result), 'Empty event')),
        map(data => fromApiEventToState(data.event, event.timelineId)),
        map(event => EventActions.successUpdateEvent({ event })),
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
const apiException = (action$ = inject(Actions)) =>
  action$.pipe(
    ofType(EventActions.apiException),
    map(() =>
      SharedActions.sendNotification({
        message: 'Something went wrong. Try again later',
        withType: 'error',
      })
    )
  );

export const eventsEffects = {
  deleteEvent: createEffect(deleteEvent, StoreDispatchEffect),
  failedDeleteEvent: createEffect(failedDeleteEvent, StoreDispatchEffect),

  pushNewEventToApi: createEffect(pushNewEventToApi, StoreDispatchEffect),
  pushExistEventToApi: createEffect(pushExistEventToApi, StoreDispatchEffect),
  saveEditableEvent: createEffect(saveEditableEvent, StoreDispatchEffect),

  apiException: createEffect(apiException, StoreDispatchEffect),
};
