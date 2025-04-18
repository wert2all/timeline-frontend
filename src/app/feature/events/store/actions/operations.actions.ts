import { createActionGroup, emptyProps, props } from '@ngrx/store';
import {
  ExistTimelineEventInput,
  TimelineEventInput,
} from '../../../../api/internal/graphql';
import { Undefined } from '../../../../app.types';
import {
  ExistTimelineEvent,
  TimelineEvent,
} from '../../../timeline/store/timeline.types';

export const EventOperationsActions = createActionGroup({
  source: 'Event Operations',
  events: {
    'Dispatch edit event': props<{ event: TimelineEvent }>(),
    'Dispatch add new event': props<{ timelineId: number }>(),
    'Stop editing event': emptyProps(),

    'Save editable event': props<{ event: TimelineEvent }>(),

    'Push new event to API': props<{ event: TimelineEventInput }>(),
    'Success push new event': props<{ event: ExistTimelineEvent }>(),

    'Update exist event on API': props<{ event: ExistTimelineEventInput }>(),
    'Success update event': props<{ event: ExistTimelineEvent }>(),

    'Confirm to delete event': props<{ eventId: number }>(),
    'Dismiss delete event': props<{ eventId: number }>(),
    'Delete event': props<{ eventId: number; imageId: number | Undefined }>(),
    'Success delete event': props<{ eventId: number }>(),
    'Failed delete event': props<{ eventId: number }>(),

    'Empty event': emptyProps(),
    'Api Exception': props<{ exception: string }>(),
  },
});
