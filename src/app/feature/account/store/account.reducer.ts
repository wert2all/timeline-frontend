import { createFeature, createReducer, on } from '@ngrx/store';
import { KeyValue } from '../../../app.types';
import { SharedActions } from '../../../shared/store/shared/shared.actions';
import { Account } from '../account.types';
import { AccountActions } from './account.actions';
import { AccountState } from './account.types';

const mergeAccountSettings = (
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
  loading: false,
  accounts: [],
  activeAccount: null,
};

export const accountFeature = createFeature({
  name: 'accounts',
  reducer: createReducer(
    initialState,

    on(
      AccountActions.dispatchSaveAccountSettings,
      AccountActions.dispatchAddNewAcoount,
      (state): AccountState => ({
        ...state,
        loading: true,
      })
    ),
    on(
      AccountActions.successSaveAccount,
      AccountActions.successAddNewAccount,
      (state): AccountState => ({
        ...state,
        loading: false,
      })
    ),

    on(AccountActions.updateOneSetting, (state, { key, value }) => ({
      ...state,
      activeAccount: mergeAccountSettings(state.activeAccount, { key, value }),
    })),

    on(
      AccountActions.couldNotAddAccount,
      (state): AccountState => ({
        ...state,
        loading: false,
      })
    ),

    on(
      AccountActions.successSaveAccount,
      AccountActions.successAddNewAccount,
      (state, { account }): AccountState => ({
        ...state,
        accounts: state.accounts.map(acc =>
          acc.id === account.id ? account : acc
        ),
      })
    ),

    on(
      SharedActions.successAuthenticated,
      AccountActions.setActiveAccountAfterInit,
      (state, { accounts }): AccountState => ({
        ...state,
        accounts,
      })
    ),

    on(
      SharedActions.logout,
      (state): AccountState => ({
        ...state,
        accounts: [],
      })
    ),

    on(
      AccountActions.successAddNewAccount,
      AccountActions.setActiveAccountAfterInit,
      AccountActions.setActiveAccountAfterAuth,
      SharedActions.switchActiveAccount,
      (state, { account }): AccountState => ({
        ...state,
        activeAccount: account,
      })
    ),

    on(
      SharedActions.cleanAccount,
      AccountActions.emptyActiveAccount,
      SharedActions.logout,

      AccountActions.errorOnInitAuth,
      SharedActions.dispatchEmptyPreviewlyTokenError,
      (state): AccountState => ({
        ...state,
        activeAccount: null,
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
        activeAccount:
          account.id === state.activeAccount?.id
            ? account
            : state.activeAccount,
      })
    )
  ),
});
