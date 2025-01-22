import { createActionGroup, props } from '@ngrx/store';
import { MessageType } from '../../feature/ui/layout/store/notifications.types';

export const SharedActions = createActionGroup({
  source: 'shared',
  events: {
    'Send notification': props<{ message: string; withType: MessageType }>(),
  },
});
