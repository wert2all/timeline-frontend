import { createActionGroup, props } from '@ngrx/store';
import { ExistTimelineEvent } from './timeline.types';

export const ListEventsActions = createActionGroup({
  source: 'List Events',
  events: {
    'Load timeline events': props<{
      timelineId: number;
      accountId: number | null;
      cursor: string | null;
    }>(),
    'Success load timeline events': props<{
      events: ExistTimelineEvent[];
      lastCursor: string | null;
      hasMore: boolean;
    }>(),

    'Error loading timeline events': props<{ error: Error }>(),
  },
});
