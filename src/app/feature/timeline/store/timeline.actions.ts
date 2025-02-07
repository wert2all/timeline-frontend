import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const TimelineActions = createActionGroup({
  source: 'New Timeline',
  events: {
    'Load timeline events': props<{
      timelineId: number;
      accountId: number | null;
      cursor: string | null;
    }>(),
    'Success load timeline': emptyProps(),

    'Error loading timeline event': props<{ error: Error }>(),
  },
});
