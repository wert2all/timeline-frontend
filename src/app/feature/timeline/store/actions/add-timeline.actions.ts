import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Undefined } from '../../../../app.types';
import { Timeline } from '../timeline.types';

export const AddTimelineActions = createActionGroup({
  source: 'Add timeline',
  events: {
    'Add timeline': props<{ name: string | Undefined; accountId: number }>(),
    'Success add timeline': props<{
      timelines: Timeline[];
      accountId: number;
    }>(),

    'Empty timeline': emptyProps(),
    'Api Exception': props<{ exception: string }>(),
  },
});
