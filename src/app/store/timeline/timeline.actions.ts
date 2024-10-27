import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Undefined } from '../../app.types';
import { ExistTimelineEvent, Timeline, TimelineEvent } from './timeline.types';

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
    'Load active timeline events': props<{ timelineId: number }>(),
    'Success load active timeline events': props<{
      events: ExistTimelineEvent[];
    }>(),

    'Show add evertForm': emptyProps(),
    'Show edit event form': props<{ eventId: number | Undefined }>(),
    'Close edit form': emptyProps(),

    'Update preview of editable event': props<{ event: TimelineEvent }>(),

    // 'Add event': emptyProps(),
    //
    // 'Push event to API': props<{ event: TimelineEventInput }>(),
    // 'Clean preview after push event': emptyProps(),
    // 'Success push event': props<{ addedEvent: TimelineEvent }>(),

    // 'Create preview': emptyProps(),
    // 'Update preview': props<{ event: TimelineEvent | null }>(),
    // 'Clean preview': emptyProps(),

    // 'Create preview for edit': props<{ eventId: number | null | undefined }>(),

    'Confirm to delete event': props<{ eventId: number }>(),
    'Delete event': props<{ eventId: number }>(),
    'Success delete event': props<{ eventId: number }>(),

    'Failed delete event': props<{ eventId: number }>(),

    'Empty event': emptyProps(),
    'Api Exception': props<{ exception: string }>(),
  },
});
