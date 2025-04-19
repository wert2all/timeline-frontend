import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Timeline } from '../timeline.types';

export const SetActiveTimelineActions = createActionGroup({
  source: 'set active',
  events: {
    'Set active timeline': props<{ timeline: Timeline; accountId: number }>(),
    'Should not set active timeline': emptyProps(),
  },
});
