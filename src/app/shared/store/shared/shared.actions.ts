import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { CookieValue } from 'vanilla-cookieconsent';
import { PosibleAccount } from '../../../feature/account/account.types';
import { MessageType } from '../../../feature/ui/layout/store/notification/notifications.types';

export const SharedActions = createActionGroup({
  source: 'shared',
  events: {
    'Send notification': props<{ message: string; withType: MessageType }>(),
    'Dispatch cookie consent': props<{ cookie: CookieValue }>(),
    'Success authenticated': props<{ accounts: PosibleAccount[] }>(),
    'Switch active account': props<{ account: PosibleAccount }>(),
    'Should login': emptyProps(),
    'Clean account': emptyProps(),
    Logout: emptyProps(),
    'Dispatch loading images': props<{ ids: number[] }>(),
    'Dispatch empty Previewly token error': emptyProps(),
  },
});
