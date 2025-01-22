import { createActionGroup, props } from '@ngrx/store';
import { CookieValue } from 'vanilla-cookieconsent';
import { MessageType } from '../../../feature/ui/layout/store/notification/notifications.types';
import { Account } from './shared.types';

export const SharedActions = createActionGroup({
  source: 'shared',
  events: {
    'Send notification': props<{ message: string; withType: MessageType }>(),
    'Dispatch cookie consent': props<{ cookie: CookieValue }>(),

    'Set active account': props<{ account: Account }>(),
  },
});
