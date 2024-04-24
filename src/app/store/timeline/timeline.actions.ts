import { createActionGroup, props } from '@ngrx/store';
import { Timeline } from './timeline.types';

export const TimelineActions = createActionGroup({
  source: 'Timeline',
  events: {
    'After authorize': props<{ timelines: Timeline[] }>(),
  },
});
