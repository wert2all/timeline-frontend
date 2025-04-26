import { createActionGroup, props } from '@ngrx/store';
import { Undefined } from '../../../../../app.types';
import { Timeline } from '../../../../timeline/store/timeline.types';

export const AddTimelineActions = createActionGroup({
  source: 'Add timeline',
  events: {
    'Add timeline': props<{ name: string | Undefined }>(),
    'Success add timeline': props<{
      timelines: Timeline[];
      accountId: number;
    }>(),

    'Failed add timeline': props<{ error: string }>(),
  },
});
