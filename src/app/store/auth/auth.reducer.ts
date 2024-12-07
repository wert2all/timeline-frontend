import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { AuthActions } from './auth.actions';
import { AuthState } from './auth.types';

const initialState: AuthState = {
  loading: false,
  authorizedUser: null,
};

export const authFeature = createFeature({
  name: 'auth',
  reducer: createReducer(
    initialState,

    on(AuthActions.promptLogin, AuthActions.initAuthorizedUser, state => ({
      ...state,
      loading: true,
    })),

    on(
      AuthActions.cleanAuthState,
      (state): AuthState => ({
        ...state,
        authorizedUser: null,
        loading: false,
      })
    ),

    on(AuthActions.initAuthorizedUser, (state, { token }) => ({
      ...state,
      token: token,
    })),

    on(
      AuthActions.successAuthorized,
      (state, { user }): AuthState => ({
        ...state,
        authorizedUser: {
          id: user.id,
          email: user.email,
          accounts: user.accounts
            .filter(account => !!account)
            .map(account => ({
              id: account.id,
              name: account.name || undefined,
              avatar: account.avatar || undefined,
              settings: account.settings.reduce(
                (prev, cur) => ({
                  ...prev,
                  [cur.key]: cur.value,
                }),
                {}
              ),
            })),
        },
        loading: false,
      })
    )
  ),

  extraSelectors: ({ selectLoading }) => ({
    isLoading: createSelector(selectLoading, loading => loading),
  }),
});
