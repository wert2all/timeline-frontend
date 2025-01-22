import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { CookieValue } from 'vanilla-cookieconsent';
import { Account } from '../../../feature/authorized/account/account.types';
import { MessageType } from '../../../feature/ui/layout/store/notification/notifications.types';

export const SharedActions = createActionGroup({
  source: 'shared',
  events: {
    'Send notification': props<{ message: string; withType: MessageType }>(),
    'Dispatch cookie consent': props<{ cookie: CookieValue }>(),

    'Set active account': props<{ account: Account }>(),
    'Set active account on redirect': props<{ account: Account }>(),
    'Empty active account': emptyProps(),
    'Clean account': emptyProps(),

    'Error on Init Auth': props<{ error: Error }>(),
  },
});
