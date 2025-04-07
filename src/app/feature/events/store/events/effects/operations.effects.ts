import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, of } from 'rxjs';
import {
  ApiClient,
  TimelineEvent as GQLTimelineEvent,
  Status,
  TimelineEventInput,
} from '../../../../../api/internal/graphql';
import { StoreDispatchEffect } from '../../../../../app.types';
import {
  apiAssertNotNull,
  extractApiData,
} from '../../../../../libs/api.functions';
import { SharedActions } from '../../../../../shared/store/shared/shared.actions';
import {
  ExistTimelineEvent,
  TimelineEvent,
  TimelineEventType,
} from '../../../../timeline/store/timeline.types';
import { EventOperationsActions } from '../actions/operations.actions';

import { TimelineType as GQLTimelineType } from '../../../../../api/internal/graphql';

const fromApiTypeToState = (type: GQLTimelineType): TimelineEventType => {
  switch (type) {
    case GQLTimelineType.default:
      return TimelineEventType.default;
    case GQLTimelineType.selebrate:
      return TimelineEventType.celebrate;
    default:
      return TimelineEventType.default;
  }
};
const fromEventTypeStateToApiType = (
  type: TimelineEventType
): GQLTimelineType | null => {
  // eslint-disable-next-line  sonarjs/no-small-switch
  switch (type) {
    case TimelineEventType.celebrate:
      return GQLTimelineType.selebrate;
    default:
      return null;
  }
};
const fromEditableEventStateToApiInput = (
  event: TimelineEvent | ExistTimelineEvent
): TimelineEventInput => ({
  id: event.id,
  date: event.date.toISOString(),
  timelineId: event.timelineId,
  type: fromEventTypeStateToApiType(event.type),
  title: event.title,
  description: event.description,
  showTime: event.showTime,
  url: event.url,
  tags: event.tags,
  previewlyImageId: event.imageId,
});

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
    ofType(EventOperationsActions.deleteEvent),
    exhaustMap(({ eventId }) =>
      api.deleteEvent({ eventId: eventId }).pipe(
        map(result => result.data?.deleteEvent || null),
        map(result =>
          result === Status.success
            ? EventOperationsActions.successDeleteEvent({ eventId: eventId })
            : EventOperationsActions.failedDeleteEvent({ eventId: eventId })
        ),
        catchError(() =>
          of(EventOperationsActions.failedDeleteEvent({ eventId: eventId }))
        )
      )
    )
  );
};

const failedDeleteEvent = (action$ = inject(Actions)) =>
  action$.pipe(
    ofType(EventOperationsActions.failedDeleteEvent),
    map(() =>
      SharedActions.sendNotification({
        message: 'Could not delete event',
        withType: 'error',
      })
    )
  );

const saveEditableEvent = (actions$ = inject(Actions)) =>
  actions$.pipe(
    ofType(EventOperationsActions.saveEditableEvent),
    map(({ event }) => fromEditableEventStateToApiInput(event)),
    map(event =>
      event.id
        ? EventOperationsActions.updateExistEventOnAPI({
            event: { ...event, id: event.id },
          })
        : EventOperationsActions.pushNewEventToAPI({ event: event })
    )
  );
const pushNewEventToApi = (
  actions$ = inject(Actions),
  api = inject(ApiClient)
) =>
  actions$.pipe(
    ofType(EventOperationsActions.pushNewEventToAPI),
    exhaustMap(({ event }) =>
      api.addTimelineEvent({ event: event }).pipe(
        map(result => apiAssertNotNull(extractApiData(result), 'Empty event')),
        map(data => fromApiEventToState(data.event, event.timelineId)),
        map(event => EventOperationsActions.successPushNewEvent({ event })),
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
    ofType(EventOperationsActions.updateExistEventOnAPI),
    exhaustMap(({ event }) =>
      api.saveExistTimelineEvent({ event: event }).pipe(
        map(result => apiAssertNotNull(extractApiData(result), 'Empty event')),
        map(data => fromApiEventToState(data.event, event.timelineId)),
        map(event => EventOperationsActions.successUpdateEvent({ event })),
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
    ofType(EventOperationsActions.apiException),
    map(() =>
      SharedActions.sendNotification({
        message: 'Something went wrong. Try again later',
        withType: 'error',
      })
    )
  );

export const eventOperationsEffects = {
  deleteEvent: createEffect(deleteEvent, StoreDispatchEffect),
  failedDeleteEvent: createEffect(failedDeleteEvent, StoreDispatchEffect),

  pushNewEventToApi: createEffect(pushNewEventToApi, StoreDispatchEffect),
  pushExistEventToApi: createEffect(pushExistEventToApi, StoreDispatchEffect),
  saveEditableEvent: createEffect(saveEditableEvent, StoreDispatchEffect),

  apiException: createEffect(apiException, StoreDispatchEffect),
};
