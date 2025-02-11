import { createFeature, createReducer, on } from '@ngrx/store';
import { SharedActions } from '../../../shared/store/shared/shared.actions';
import { AccountActions } from './account.actions';
import { AccountState } from './account.types';

const initialState: AccountState = {
  loading: false,
  accounts: [],
};

export const accountFeature = createFeature({
  name: 'account',
  reducer: createReducer(
    initialState,

    on(
      AccountActions.setUserAccounts,
      (state, { accounts }): AccountState => ({
        ...state,
        accounts: accounts,
      })
    ),

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
      SharedActions.logout,
      (state): AccountState => ({
        ...state,
        accounts: [],
      })
    )
  ),
});
