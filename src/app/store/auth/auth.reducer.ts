import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { AuthActions } from './auth.actions';
import { AuthState } from './auth.types';

const initialState: AuthState = {
  loading: false,
  authorizedUser: null,
  activeAccount: null,
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
        activeAccount: null,
        loading: false,
      })
    ),

    on(AuthActions.initAuthorizedUser, (state, { token }) => ({
      ...state,
      token: token,
    })),

    on(
      AuthActions.successAuthorized,
      (state, { account, user }): AuthState => ({
        ...state,
        activeAccount: {
          id: account.id,
          name: account.name || undefined,
          avatar: account.avatar || undefined,
          settings: account.settings || [],
        },
        authorizedUser: {
          id: user.id,
          email: user.email,
          accounts: user.accounts
            .filter(account => !!account)
            .map(account => ({
              id: account.id,
              name: account.name || undefined,
              avatar: account.avatar || undefined,
              settings: account.settings || [],
            })),
        },
        loading: false,
      })
    )
  ),

  extraSelectors: ({ selectLoading, selectActiveAccount }) => ({
    isLoading: createSelector(selectLoading, loading => loading),
    isAuthorized: createSelector(
      selectActiveAccount,
      account => account != null
    ),
  }),
});
