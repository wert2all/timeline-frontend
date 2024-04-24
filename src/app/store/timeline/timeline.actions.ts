import { createActionGroup, props } from '@ngrx/store';
import { Timeline, TimelineEvent } from './timeline.types';

export const TimelineActions = createActionGroup({
  source: 'Timeline',
  events: {
    'After authorize': props<{ timelines: Timeline[] }>(),
    'Add event': props<{ event: TimelineEvent }>(),
  },
});
