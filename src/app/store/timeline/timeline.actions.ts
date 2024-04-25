import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Timeline, TimelineEvent } from './timeline.types';

export const TimelineActions = createActionGroup({
  source: 'Timeline',
  events: {
    'Update timelines after authorize': props<{ timelines: Timeline[] }>(),

    'Set active timeline after authorize': props<{
      timeline: Timeline | null;
    }>(),

    'Add timeline': props<{ name: string | null | undefined }>(),
    'Add timeline after login': props<{ name: string | null | undefined }>(),
    'Add event': props<{ event: TimelineEvent }>(),

    'Success add timeline': props<{ timelines: Timeline[] }>(),
    'Success add timeline after login': props<{ timelines: Timeline[] }>(),

    'Empty timeline': emptyProps(),
    'Api Exception': props<{ exception: string }>(),
  },
});
