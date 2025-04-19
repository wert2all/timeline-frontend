import { createActionGroup, props } from '@ngrx/store';
import { ShortTimeline, Timeline } from '../../../../api/internal/graphql';

export const LoadTimelinesActions = createActionGroup({
  source: 'Timeline',
  events: {
    'Load timeline': props<{ timelineId: number }>(),
    'Success load timeline': props<{ timeline: Timeline }>(),
    'Error Load Timeline': props<{ error: Error }>(),

    'Load account timelines': props<{ accountId: number }>(),
    'Success load account timelines': props<{
      timelines: (ShortTimeline & { accountId: number })[];
      accountId: number;
    }>(),
  },
});
