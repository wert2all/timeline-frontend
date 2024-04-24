import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { User } from '../../api/graphql';
import { AuthorizedUser, GoogleUserInfo } from './auth.types';

export const AuthActions = createActionGroup({
  source: 'Auth',
  events: {
    'Init authorized user': props<{ token: string }>(),
    'Empty initial token': emptyProps(),
    'Prompt Login': emptyProps(),
    'Prompt not displayed': props<{ reason: string }>(),
    'Load user success': props<{ token: string; user: User }>(),
    'Set token and profile': props<{
      token: string;
      profile: GoogleUserInfo;
    }>(),
    Authorized: props<{ token: string; user: AuthorizedUser }>(),
    Logout: emptyProps(),

    'Empty profile': emptyProps(),
    'Api Exception': props<{ exception: string }>(),
    'User email is not verified': emptyProps(),
  },
});
