import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { Account, CookieCategory, SharedState } from './shared.types';

import { KeyValue } from '../../../app.types';
import { AccountActions } from '../../../store/account/account.actions';
import { AuthActions } from '../../../store/auth/auth.actions';
import { AccountFeaturesSettings } from '../../services/features.service';
import { SharedActions } from './shared.actions';

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

const initialState: SharedState = { cookie: [], activeAccount: null };

export const sharedFeature = createFeature({
  name: 'shared',
  reducer: createReducer(
    initialState,

    on(
      SharedActions.dispatchCookieConsent,
      (state, { cookie }): SharedState => ({
        ...state,
        cookie: (cookie.categories || [])
          .map(category => {
            if (category === CookieCategory.ANALYTICS.toLowerCase()) {
              return CookieCategory.ANALYTICS;
            }
            if (category === CookieCategory.NECESSARY.toLowerCase()) {
              return CookieCategory.NECESSARY;
            }
            return null;
          })
          .filter(Boolean) as CookieCategory[],
      })
    ),

    on(
      SharedActions.setActiveAccount,
      (state, { account }): SharedState => ({
        ...state,
        activeAccount: account,
      })
    ),

    on(
      AuthActions.dispatchBackendApiAuthError,
      AuthActions.dispatchLogout,
      AuthActions.dispatchEmptyUserProfileOnInit,
      AccountActions.cleanAccount,
      (state): SharedState => ({
        ...state,
        activeAccount: null,
      })
    ),
    on(
      AccountActions.setAccount,
      AccountActions.successSaveAccount,
      (state, { account }): SharedState => ({
        ...state,
        activeAccount: account,
      })
    ),
    on(
      AccountActions.updateOneSetting,
      (state, action): SharedState => ({
        ...state,
        activeAccount: mergeAccountSettings(state.activeAccount, {
          key: action.key,
          value: action.value,
        }),
      })
    )
  ),
  extraSelectors: ({ selectCookie, selectActiveAccount }) => ({
    isAuthorized: createSelector(selectActiveAccount, account => !!account),
    canUseNecessaryCookies: createSelector(selectCookie, cookie =>
      cookie.includes(CookieCategory.NECESSARY)
    ),
    selectActiveAccountFeatureSettings: createSelector(
      selectActiveAccount,
      (account): AccountFeaturesSettings => {
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
