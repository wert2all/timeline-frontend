import { createFeature, createReducer, createSelector, on } from '@ngrx/store';

import { AuthActions } from './auth.actions';
import { AuthState } from './auth.types';

const initialState: AuthState = {
  token: null,
  loading: false,
  authorizedUser: null,
  potentialUser: null,
};

export const authFeature = createFeature({
  name: 'auth',
  reducer: createReducer(
    initialState,
    on(
      AuthActions.promptLogin,
      AuthActions.setTokenAndProfile,
      AuthActions.initAuthorizedUser,
      state => ({
        ...state,
        loading: true,
      })
    ),
    on(
      AuthActions.promptNotDisplayed,
      AuthActions.userEmailIsNotVerified,
      AuthActions.emptyProfile,
      AuthActions.apiException,
      AuthActions.authorized,
      AuthActions.logout,
      state => ({
        ...state,
        authorizedUser: null,
        token: null,
        loading: false,
        potentialUser: null,
      })
    ),
    on(AuthActions.initAuthorizedUser, (state, { token }) => ({
      ...state,
      token: token,
    })),
    on(AuthActions.setTokenAndProfile, (state, { token, profile }) => ({
      ...state,
      token: token,
      potentialUser: { name: profile.name, avatar: profile.picture },
    })),
    on(AuthActions.authorized, (state, { user }) => ({
      ...state,
      authorizedUser: user,
    }))
  ),
  extraSelectors: ({
    selectLoading,
    selectAuthorizedUser,
    selectPotentialUser,
  }) => ({
    isLoading: createSelector(selectLoading, loading => loading),
    isAuthorized: createSelector(
      selectAuthorizedUser,
      authorizedUser => authorizedUser != null
    ),
    selectPotentialUser: createSelector(
      selectPotentialUser,
      selectAuthorizedUser,
      (potential, authorized) => (authorized ? authorized : potential)
    ),
  }),
});
