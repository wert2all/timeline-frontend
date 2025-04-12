import { createActionGroup, props } from '@ngrx/store';

import {
  TimelineEvent as GQLTimelineEvent,
  Timeline,
} from '../../../../api/internal/graphql';

export const ShowEventActions = createActionGroup({
  source: 'Show Event',
  events: {
    'Load event': props<{ eventId: number }>(),
    'Success load event': props<{
      event: GQLTimelineEvent & { timeline: Timeline };
    }>(),
    'Error load event': props<{ error: Error }>(),
  },
});
