import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { KeyValue } from '../../app.types';
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

const initialState: AccountState = { activeAccount: null };

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
    })),

    on(AccountActions.updateOneSetting, (state, action) => ({
      ...state,
      activeAccount: mergeAccountSettings(state.activeAccount, {
        key: action.key,
        value: action.value,
      }),
    }))
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
