import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { TimelineEventInput } from '../../api/internal/graphql';
import { EditableTimelineEvent } from '../../widgets/timeline-container/timeline.types';
import { Timeline, TimelineEvent } from './timeline.types';

export const TimelineActions = createActionGroup({
  source: 'Timeline',
  events: {
    'Set active timeline after authorize': props<{
      timeline: Timeline | null;
    }>(),

    'Add timeline': props<{ name: string | null | undefined }>(),
    'Add timeline after login': props<{ name: string | null | undefined }>(),

    'Success add timeline': props<{ timelines: Timeline[] }>(),
    'Success add timeline after login': props<{ timelines: Timeline[] }>(),

    'Empty timeline': emptyProps(),
    'Api Exception': props<{ exception: string }>(),
  },
});

export const EventActions = createActionGroup({
  source: 'Event',
  events: {
    'Add event': emptyProps(),

    'Push event to API': props<{ event: TimelineEventInput }>(),
    'Clean preview after push event': emptyProps(),

    'Load active timeline events': props<{ timelineId: number }>(),

    'Success push event': props<{ addedEvent: TimelineEvent }>(),
    'Success load active timeline events': props<{ events: TimelineEvent[] }>(),

    'Create preview': emptyProps(),
    'Update preview': props<{ event: EditableTimelineEvent | null }>(),
    'Clean preview': emptyProps(),

    'Confirm to delete event': props<{ eventId: number }>(),
    'Delete event': props<{ eventId: number }>(),
    'Success delete event': props<{ eventId: number }>(),

    'Failed delete event': props<{ eventId: number }>(),

    'Empty event': emptyProps(),
    'Api Exception': props<{ exception: string }>(),
  },
});
