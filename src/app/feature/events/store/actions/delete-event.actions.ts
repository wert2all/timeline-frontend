import { createActionGroup, props } from '@ngrx/store';
import { Undefined } from '../../../../app.types';

export const DeleteEventActions = createActionGroup({
  source: 'Delete event',
  events: {
    'Confirm to delete event': props<{ eventId: number }>(),
    'Dismiss delete event': props<{ eventId: number }>(),
    'Delete event': props<{ eventId: number; imageId: number | Undefined }>(),
    'Failed delete event': props<{ eventId: number }>(),
    'Success delete event': props<{ eventId: number }>(),
  },
});
