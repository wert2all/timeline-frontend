import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { KeyValue } from '../../app.types';
import { AuthActions } from '../auth/auth.actions';
import { AccountActions } from './account.actions';
import { Account, AccountState } from './account.types';

export const mergeAccountSettings = (
  account: Account | null,
  { key, value }: KeyValue<string>
): Account | null => {
  if (account) {
    const settings = { ...account?.settings };
    if (settings) {
      settings[key] = value;
    }
    return { ...account, settings };
  } else {
    return null;
  }
};

const initialState: AccountState = {
  activeAccount: null,
  activeUser: null,
  loading: false,
};

export const accountFeature = createFeature({
  name: 'account',
  reducer: createReducer(
    initialState,

    on(
      AccountActions.dispatchSaveAccountSettings,
      (state): AccountState => ({
        ...state,
        loading: true,
      })
    ),
    on(
      AccountActions.successSaveAccount,
      (state): AccountState => ({
        ...state,
        loading: false,
      })
    ),

    on(
      AccountActions.setUser,
      AccountActions.setUserOnRedirect,
      (state, { user }): AccountState => ({
        ...state,
        activeUser: user,
      })
    ),

    on(
      AuthActions.dispatchBackendApiAuthError,
      AuthActions.dispatchLogout,
      AuthActions.dispatchEmptyUserProfileOnInit,
      (state): AccountState => ({
        ...state,
        activeUser: null,
        activeAccount: null,
      })
    ),

    on(
      AccountActions.cleanAccount,
      (state): AccountState => ({
        ...state,
        activeAccount: null,
      })
    ),

    on(
      AccountActions.setAccount,
      (state, { account }): AccountState => ({
        ...state,
        activeAccount: account,
      })
    ),

    on(
      AccountActions.updateOneSetting,
      (state, action): AccountState => ({
        ...state,
        activeAccount: mergeAccountSettings(state.activeAccount, {
          key: action.key,
          value: action.value,
        }),
      })
    ),
    on(
      AccountActions.successSaveAccount,
      (state, { account }): AccountState => ({
        ...state,
        activeAccount: account,
      })
    )
  ),
  extraSelectors: ({ selectActiveAccount }) => ({
    isAuthorized: createSelector(selectActiveAccount, account => !!account),
    selectActiveAccountFeaturesSettings: createSelector(
      selectActiveAccount,
      account => {
        const settings: Record<string, string | boolean> = {};
        if (account) {
          Object.entries(account.settings).forEach(([key, value]) => {
            if (value === 'true' || value === 'false') {
              settings[key] = value === 'true';
            } else {
              settings[key] = value;
            }
          });
        }
        return settings;
      }
    ),
  }),
});
