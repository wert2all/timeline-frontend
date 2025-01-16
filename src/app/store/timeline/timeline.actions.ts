import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Undefined } from '../../app.types';
import { Timeline } from './timeline.types';

export const TimelineActions = createActionGroup({
  source: 'Timeline',
  events: {
    'Load account timelines': props<{ accountId: number }>(),
    'Success load account timelines': props<{ timelines: Timeline[] }>(),

    'Set active timeline': props<{ timeline: Timeline }>(),
    'Should not set active timeline': emptyProps(),

    'Add timeline': props<{ name: string | Undefined; accountId: number }>(),
    'Success add timeline': props<{ timelines: Timeline[] }>(),

    'Empty timeline': emptyProps(),
    'Empty timelines': emptyProps(),
    'Api Exception': props<{ exception: string }>(),
  },
});
