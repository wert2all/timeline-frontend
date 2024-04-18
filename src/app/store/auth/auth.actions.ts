import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { AuthorizedUser, GoogleUserInfo } from './auth.types';

export const AuthActions = createActionGroup({
  source: 'Auth',
  events: {
    'Init state': emptyProps(),
    'Prompt Login': emptyProps(),
    'Prompt not displayed': props<{ reason: string }>(),

    'Set token and profile': props<{
      token: string;
      profile: GoogleUserInfo;
    }>(),
    Authorized: props<{ token: string; user: AuthorizedUser }>(),

    'Empty profile': emptyProps(),
    'Api Exception': props<{ exception: string }>(),
    'User email is not verified': emptyProps(),
  },
});
