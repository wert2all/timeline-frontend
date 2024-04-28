import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { EditableTimelineEvent } from '../../widgets/timeline-container/timeline.types';
import { Timeline } from './timeline.types';

export const TimelineActions = createActionGroup({
  source: 'Timeline',
  events: {
    'Update timelines after authorize': props<{ timelines: Timeline[] }>(),

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
    'Create preview': emptyProps(),
    'Update preview': props<{ event: EditableTimelineEvent | null }>(),
    'Clean preview': emptyProps(),
  },
});
