import { createActionGroup, props } from '@ngrx/store';
import { Timeline, TimelineEvent } from './timeline.types';

export const TimelineActions = createActionGroup({
  source: 'Timeline',
  events: {
    'Update timelines after authorize': props<{ timelines: Timeline[] }>(),
    'Set active timeline after authorize': props<{
      timeline: Timeline | null;
    }>(),
    'Add event': props<{ event: TimelineEvent }>(),
  },
});
