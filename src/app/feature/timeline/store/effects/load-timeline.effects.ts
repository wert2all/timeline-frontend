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
import { TimelineActions } from '../timeline.actions';
import { ExistTimelineEvent, TimelineEventType } from '../timeline.types';

const fromApiTypeToEventType = (type: GQLTimelineType): TimelineEventType => {
  switch (type) {
    case GQLTimelineType.default:
      return TimelineEventType.default;
    case GQLTimelineType.selebrate:
      return TimelineEventType.celebrate;
    default:
      return TimelineEventType.default;
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

export const loadTimelineEffects = {
  loadTimelineEvents: createEffect(
    (actions$ = inject(Actions), api = inject(ApiClient)) =>
      actions$.pipe(
        ofType(TimelineActions.loadTimelineEvents),
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
          TimelineActions.successLoadTimeline({
            events,
            lastCursor: lastCursor,
            hasMore,
          })
        ),
        catchError(error =>
          of(TimelineActions.errorLoadingTimelineEvent({ error }))
        )
      ),
    StoreDispatchEffect
  ),
};
