import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, of } from 'rxjs';
import {
  ApiClient,
  TimelineEvent as GQLTimelineEvent,
  TimelineType as GQLTimelineType,
} from '../../../../api/internal/graphql';
import { StoreDispatchEffect } from '../../../../app.types';
import {
  apiAssertNotNull,
  extractApiData,
} from '../../../../libs/api.functions';
import { SharedActions } from '../../../../shared/store/shared/shared.actions';
import {
  EventType,
  ExistTimelineEvent,
} from '../../../events/store/events.types';
import { ListEventsActions } from '../actions/list-timeline-events.actions';

const fromApiTypeToEventType = (type: GQLTimelineType): EventType => {
  switch (type) {
    case GQLTimelineType.default:
      return EventType.default;
    case GQLTimelineType.selebrate:
      return EventType.celebrate;
    default:
      return EventType.default;
  }
};
const createEvents = (
  events: GQLTimelineEvent[],
  timelineId: number
): ExistTimelineEvent[] =>
  events.map(event => ({
    id: event.id,
    timelineId: timelineId,
    date: new Date(event.date),
    type: fromApiTypeToEventType(event.type),
    title: event.title || undefined,
    description: event.description || undefined,
    showTime: event.showTime === true,
    url: event.url || undefined,
    loading: false,
    tags: event.tags || [],
    imageId: event.previewlyImageId || undefined,
  }));
export const timelineEffects = {
  loadTimelineEvents: createEffect(
    (actions$ = inject(Actions), api = inject(ApiClient)) => {
      return actions$.pipe(
        ofType(ListEventsActions.loadTimelineEvents),
        exhaustMap(options =>
          api.getEvents(options).pipe(
            map(result =>
              apiAssertNotNull(
                extractApiData(result)?.events,
                'Could not load timeline'
              )
            ),
            map(result => ({
              events: createEvents(result.events, options.timelineId),
              pageInfo: result.page,
              lastCursor: result.page.endCursor || null,
              hasMore: result.page.hasNextPage,
            }))
          )
        ),
        map(({ events, lastCursor, hasMore }) =>
          ListEventsActions.successLoadTimelineEvents({
            events,
            lastCursor: lastCursor,
            hasMore,
          })
        ),
        catchError(error =>
          of(ListEventsActions.errorLoadingTimelineEvents({ error }))
        )
      );
    },
    StoreDispatchEffect
  ),

  loadImagesAfterSuccesLoadEvents: createEffect(
    (actions$ = inject(Actions)) => {
      return actions$.pipe(
        ofType(ListEventsActions.successLoadTimelineEvents),
        map(({ events }): number[] =>
          events
            .map(event => event.imageId)
            .filter(Boolean)
            .map(id => id!)
        ),
        map(ids => SharedActions.dispatchLoadingImages({ ids }))
      );
    },
    StoreDispatchEffect
  ),
};
