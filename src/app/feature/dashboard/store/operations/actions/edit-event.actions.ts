import { createActionGroup, emptyProps, props } from '@ngrx/store';
import {
  ExistTimelineEventInput,
  TimelineEventInput,
} from '../../../../../api/internal/graphql';
import {
  ExistTimelineEvent,
  TimelineEvent,
} from '../../../../events/store/events.types';

export const EditEventActions = createActionGroup({
  source: 'Event Operations',
  events: {
    'Dispatch edit event': props<{ eventId: number }>(),
    'Success load edit event': props<{ event: TimelineEvent }>(),
    'Dispatch add new event': props<{ timelineId: number }>(),
    'Stop editing event': emptyProps(),

    'Save editable event': props<{ event: TimelineEvent }>(),

    'Push new event to API': props<{ event: TimelineEventInput }>(),
    'Success push new event': props<{ event: ExistTimelineEvent }>(),

    'Update exist event on API': props<{ event: ExistTimelineEventInput }>(),
    'Success update event': props<{ event: ExistTimelineEvent }>(),

    'Empty event': emptyProps(),
    'Api Exception': props<{ exception: string }>(),
  },
});
