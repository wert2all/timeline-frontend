import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { CookieCategory, SharedState } from './shared.types';

import { toFeaturesSettings } from '../../../feature/account/account.functions';
import { accountFeature } from '../../../feature/account/store/account.reducer';
import { AccountFeaturesSettings } from '../../services/features.service';
import { imagesFeature } from '../images/images.reducer';
import { SharedActions } from './shared.actions';

const initialState: SharedState = { cookie: [] };

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
    )
  ),
  extraSelectors: ({ selectCookie }) => ({
    isAuthorized: createSelector(
      accountFeature.selectActiveAccount,
      account => !!account
    ),
    canUseNecessaryCookies: createSelector(selectCookie, cookie =>
      cookie.includes(CookieCategory.NECESSARY)
    ),
    selectActiveAccount: accountFeature.selectActiveAccount,
    selectActiveAccountId: createSelector(
      accountFeature.selectActiveAccount,
      account => account?.id
    ),
    selectActiveAccountFeatureSettings: createSelector(
      accountFeature.selectActiveAccount,
      (account): AccountFeaturesSettings => toFeaturesSettings(account)
    ),
    selectUserAccounts: createSelector(
      accountFeature.selectUserAccounts,
      accounts => accounts
    ),
    selectLoadingAccounts: createSelector(
      accountFeature.selectLoading,
      loading => loading
    ),
    selectAccounts: createSelector(
      accountFeature.selectAccounts,
      accounts => accounts
    ),
    selectLoadedImages: createSelector(
      imagesFeature.selectLoadedImages,
      images => images
    ),
  }),
});
