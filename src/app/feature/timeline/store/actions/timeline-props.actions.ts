import { createActionGroup, props } from '@ngrx/store';
import { Timeline } from '../../../../api/internal/graphql';

export const TimelinePropsActions = createActionGroup({
  source: 'Timeline Account',
  events: {
    'Load timeline': props<{ timelineId: number }>(),
    'Success load timeline': props<{ timeline: Timeline }>(),
    'Error Load Timeline': props<{ error: Error }>(),
  },
});
