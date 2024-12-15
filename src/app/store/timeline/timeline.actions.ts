import { createActionGroup, emptyProps, props } from '@ngrx/store';
import {
  ExistTimelineEventInput,
  TimelineEventInput,
} from '../../api/internal/graphql';
import { Undefined } from '../../app.types';
import { ExistTimelineEvent, Timeline, TimelineEvent } from './timeline.types';

export const TimelineActions = createActionGroup({
  source: 'Timeline',
  events: {
    'Set active timeline after authorize': props<{
      timeline: Timeline | null;
    }>(),

    'Add timeline': props<{ name: string | Undefined; accountId: number }>(),
    'Success add timeline': props<{ timelines: Timeline[] }>(),

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

    'Show add event form': props<{ timelineId: number }>(),
    'Show edit event form': props<{ eventId: number | Undefined }>(),
    'Close edit form': emptyProps(),

    'Update preview of editable event': props<{ event: TimelineEvent }>(),
    'Save editable event': emptyProps(),

    'Push new event to API': props<{ event: TimelineEventInput }>(),
    'Success push new event': props<{ event: ExistTimelineEvent }>(),

    'Update exist event on API': props<{ event: ExistTimelineEventInput }>(),
    'Success update event': props<{ event: ExistTimelineEvent }>(),

    'Nothing to save': emptyProps(),

    'Confirm to delete event': props<{ eventId: number }>(),
    'Delete event': props<{ eventId: number }>(),
    'Success delete event': props<{ eventId: number }>(),

    'Failed delete event': props<{ eventId: number }>(),

    'Empty event': emptyProps(),
    'Api Exception': props<{ exception: string }>(),
  },
});
