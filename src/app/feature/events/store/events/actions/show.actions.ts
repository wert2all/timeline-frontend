import { createActionGroup, props } from '@ngrx/store';
import { ExistTimelineEvent } from '../../../../timeline/store/timeline.types';

export const ShowEventActions = createActionGroup({
  source: 'Show Event',
  events: {
    'Load event': props<{ eventId: number }>(),
    'Success load event': props<{ event: ExistTimelineEvent }>(),
    'Error load event': props<{ error: Error }>(),
  },
});
