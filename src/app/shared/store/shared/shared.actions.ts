import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { CookieValue } from 'vanilla-cookieconsent';
import { Undefined } from '../../../app.types';
import { ShortAccount } from '../../../feature/account/account.types';
import { MessageType } from '../../handlers/error.types';
import { Destination } from '../../services/navigation/navigation-builder.types';

export const SharedActions = createActionGroup({
  source: 'shared',
  events: {
    Navigate: props<{ destination: Destination }>(),
    'Navigate to URL': props<{ url: string }>(),
    'Send notification': props<{ message: string; withType: MessageType }>(),
    'Dispatch cookie consent': props<{ cookie: CookieValue }>(),
    'Success authenticated': props<{
      accounts: ShortAccount[];
      redirect: string | Undefined;
    }>(),
    'Switch active account': props<{ account: ShortAccount }>(),
    'Should login': emptyProps(),
    'Clean account': emptyProps(),
    Logout: emptyProps(),
    'Dispatch loading images': props<{ ids: number[] }>(),
    'Dispatch empty Previewly token error': emptyProps(),
  },
});
