import { createActionGroup, props } from '@ngrx/store';

export const TimelineActions = createActionGroup({
  source: 'New Timeline',
  events: {
    'Load timeline events': props<{ timelineId: number }>(),
  },
});
