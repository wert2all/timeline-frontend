import { inject } from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, of, tap } from 'rxjs';
import {
  ApiClient,
  TimelineEvent as GQLTimelineEvent,
  TimelineEventInput,
} from '../../../../../api/internal/graphql';
import {
  apiAssertNotNull,
  extractApiData,
} from '../../../../../libs/api.functions';
import { SharedActions } from '../../../../../shared/store/shared/shared.actions';
import { EditEventActions } from '../actions/edit-event.actions';

import { TimelineType as GQLTimelineType } from '../../../../../api/internal/graphql';
import { ErrorHandler } from '../../../../../shared/handlers/error.handler';
import { ErrorMessage } from '../../../../../shared/handlers/error.types';
import { NavigationBuilder } from '../../../../../shared/services/navigation/navigation.builder';
import {
  EventType,
  ExistTimelineEvent,
  TimelineEvent,
} from '../../../../events/store/events.types';

const fromApiTypeToState = (type: GQLTimelineType): EventType => {
  switch (type) {
    case GQLTimelineType.default:
      return EventType.default;
    case GQLTimelineType.selebrate:
      return EventType.celebrate;
    default:
      return EventType.default;
  }
};
const fromEventTypeStateToApiType = (
  type: EventType
): GQLTimelineType | null => {
  // eslint-disable-next-line  sonarjs/no-small-switch
  switch (type) {
    case EventType.celebrate:
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
  event: GQLTimelineEvent
): ExistTimelineEvent => ({
  id: event.id,
  date: new Date(event.date),
  type: fromApiTypeToState(event.type),
  timelineId: event.timelineId,
  title: event.title || undefined,
  description: event.description || undefined,
  showTime: event.showTime === true,
  url: event.url || undefined,
  loading: false,
  tags: event.tags || [],
  imageId: event.previewlyImageId || undefined,
});

export const saveEditableEvent = (actions$ = inject(Actions)) =>
  actions$.pipe(
    ofType(EditEventActions.saveEditableEvent),
    map(({ event }) => fromEditableEventStateToApiInput(event)),
    map(event =>
      event.id
        ? EditEventActions.updateExistEventOnAPI({
            event: { ...event, id: event.id },
          })
        : EditEventActions.pushNewEventToAPI({ event: event })
    )
  );

export const pushNewEventToApi = (
  actions$ = inject(Actions),
  api = inject(ApiClient)
) => {
  return actions$.pipe(
    ofType(EditEventActions.pushNewEventToAPI),
    exhaustMap(({ event }) =>
      api.addTimelineEvent({ event: event }).pipe(
        map(result => apiAssertNotNull(extractApiData(result), 'Empty event')),
        map(data => fromApiEventToState(data.event))
      )
    ),
    map(event => EditEventActions.successPushNewEvent({ event })),
    catchError(error =>
      of(
        SharedActions.sendNotification({
          message: error,
          withType: 'error',
        })
      )
    )
  );
};

export const pushExistEventToApi = (
  actions$ = inject(Actions),
  api = inject(ApiClient)
) =>
  actions$.pipe(
    ofType(EditEventActions.updateExistEventOnAPI),
    exhaustMap(({ event }) =>
      api.saveExistTimelineEvent({ event: event }).pipe(
        map(result => apiAssertNotNull(extractApiData(result), 'Empty event')),
        map(data => fromApiEventToState(data.event))
      )
    ),
    map(event => EditEventActions.successUpdateEvent({ event })),
    catchError(error =>
      of(
        SharedActions.sendNotification({
          message: error,
          withType: 'error',
        })
      )
    )
  );

export const redirectOnCloseEditEvent = (
  action$ = inject(Actions),
  navigationBulder = inject(NavigationBuilder)
) =>
  action$.pipe(
    ofType(EditEventActions.stopEditingEvent),
    map(() =>
      SharedActions.navigate({
        destination: navigationBulder.forDashboard().index(),
      })
    )
  );

export const loadEditEventData = (
  actions$ = inject(Actions),
  api = inject(ApiClient)
) =>
  actions$.pipe(
    ofType(EditEventActions.dispatchEditEvent),
    exhaustMap(({ eventId }) =>
      api.getEvent({ eventId }).pipe(
        map(result =>
          apiAssertNotNull(extractApiData(result)?.event, 'Empty event')
        ),
        map(event => fromApiEventToState(event))
      )
    ),
    map(event => EditEventActions.successLoadEditEvent({ event })),
    catchError(error => of(EditEventActions.apiException({ exception: error })))
  );

export const apiException = (
  action$ = inject(Actions),
  errorHandler = inject(ErrorHandler)
) =>
  action$.pipe(
    ofType(EditEventActions.apiException),
    tap(() => {
      errorHandler.handleError(
        new ErrorMessage('Something went wrong. Try again later')
          .notified()
          .loggable()
          .error()
      );
    })
  );
