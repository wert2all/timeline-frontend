import { createActionGroup, props } from '@ngrx/store';
import { ExistTimelineEvent } from './timeline.types';

export const TimelineActions = createActionGroup({
  source: 'Timeline Events',
  events: {
    'Load timeline events': props<{
      timelineId: number;
      accountId: number | null;
      cursor: string | null;
    }>(),
    'Success load timeline': props<{
      events: ExistTimelineEvent[];
      lastCursor: string | null;
      hasMore: boolean;
    }>(),

    'Error loading timeline event': props<{ error: Error }>(),
  },
});
