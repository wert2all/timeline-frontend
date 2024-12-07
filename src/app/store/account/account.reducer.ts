import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { AccountActions } from './account.actions';
import { AccountState } from './account.types';

const initialState: AccountState = {
  activeAccount: null,
};

export const accountFeature = createFeature({
  name: 'account',
  reducer: createReducer(
    initialState,
    on(AccountActions.cleanAccount, state => ({
      ...state,
      activeAccount: null,
    })),

    on(AccountActions.setAccount, (state, { account }) => ({
      ...state,
      activeAccount: account,
    }))
  ),
  extraSelectors: ({ selectActiveAccount }) => ({
    isAuthorized: createSelector(selectActiveAccount, account => !!account),
  }),
});
