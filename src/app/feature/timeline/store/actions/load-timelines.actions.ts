import { createActionGroup, props } from '@ngrx/store';
import { Timeline } from '../../../../api/internal/graphql';

export const LoadTimelinesActions = createActionGroup({
  source: 'Timeline',
  events: {
    'Load timeline': props<{ timelineId: number }>(),
    'Success load timeline': props<{ timeline: Timeline }>(),
    'Error Load Timeline': props<{ error: Error }>(),
  },
});
