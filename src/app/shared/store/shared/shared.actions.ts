import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { CookieValue } from 'vanilla-cookieconsent';
import { Account } from '../../../feature/account/account.types';
import { MessageType } from '../../../feature/ui/layout/store/notification/notifications.types';

export const SharedActions = createActionGroup({
  source: 'shared',
  events: {
    'Send notification': props<{ message: string; withType: MessageType }>(),
    'Dispatch cookie consent': props<{ cookie: CookieValue }>(),

    'Set active account after init': props<{ account: Account }>(),
    'Set active account and redirect': props<{ account: Account }>(),
    'Set active account after adding': props<{ account: Account }>(),

    'Switch active account': props<{ account: Account }>(),

    'Empty active account': emptyProps(),
    'Clean account': emptyProps(),
    Logout: emptyProps(),

    'Dispatch loading images': props<{ ids: number[] }>(),

    'Error on Init Auth': props<{ error: Error }>(),
    'dispatch empty Previewly token error': emptyProps(),
  },
});
