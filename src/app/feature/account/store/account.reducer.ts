import { createFeature, createReducer, on } from '@ngrx/store';
import { AccountActions } from './account.actions';
import { AccountState } from './account.types';

const initialState: AccountState = {
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
    )
  ),
});
