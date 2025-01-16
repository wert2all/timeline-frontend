import { createActionGroup, emptyProps, props } from '@ngrx/store';
import {
  ExistTimelineEventInput,
  TimelineEventInput,
} from '../../api/internal/graphql';
import { Undefined } from '../../app.types';
import { ExistTimelineEvent, TimelineEvent } from './events.types';

export const EventActions = createActionGroup({
  source: 'Event',
  events: {
    'Load timeline events': props<{ timelineId: number }>(),
    'Success load timeline events': props<{ events: ExistTimelineEvent[] }>(),

    'Dispatch edit event': props<{ eventId: number | Undefined }>(),
    'Stop editing event': emptyProps(),

    'Save editable event': props<{
      event: TimelineEvent | ExistTimelineEvent;
    }>(),

    'Push new event to API': props<{ event: TimelineEventInput }>(),
    'Success push new event': props<{ events: ExistTimelineEvent[] }>(),

    'Update exist event on API': props<{ event: ExistTimelineEventInput }>(),
    'Success update event': props<{ events: ExistTimelineEvent[] }>(),

    'Confirm to delete event': props<{ eventId: number }>(),
    'Delete event': props<{ eventId: number; imageId: number | Undefined }>(),
    'Success delete event': props<{ eventId: number }>(),
    'Failed delete event': props<{ eventId: number }>(),

    'Empty event': emptyProps(),
    'Api Exception': props<{ exception: string }>(),
  },
});
