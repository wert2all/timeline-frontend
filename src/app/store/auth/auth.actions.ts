import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Account, User } from '../../api/internal/graphql';
import { AuthorizedUser, GoogleUserInfo } from './auth.types';

export const AuthActions = createActionGroup({
  source: 'Auth',
  events: {
    'Init authorized user': props<{ token: string }>(),
    'Empty initial token': emptyProps(),
    'Prompt Login': emptyProps(),
    'Prompt not displayed': emptyProps(),
    'Success load user': props<{ token: string; user: User }>(),
    'Set token and profile': props<{
      token: string;
      profile: GoogleUserInfo;
    }>(),
    'Success load user after init': props<{ token: string; user: User }>(),
    'Coulnd not load user after init': emptyProps(),

    Authorized: props<{ token: string; user: AuthorizedUser }>(),
    Logout: emptyProps(),

    'Empty profile': emptyProps(),
    'Api Exception': props<{ exception: string }>(),
    'User email is not verified': emptyProps(),

    'Clean auth state': emptyProps(),

    'Update active account from storage': props<{ accountId: string | null }>(),
    'Success update active account from storage': props<{ account: Account }>(),

    'Select active account': props<{ accounts: Account[] }>(),
    'Set one exist account as active': emptyProps(),
    'Success select active account': props<{ account: Account }>(),
  },
});
