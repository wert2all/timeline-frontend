import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { CookieCategory, SharedState } from './shared.types';

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
    canUseNecessaryCookies: createSelector(selectCookie, cookie =>
      cookie.includes(CookieCategory.NECESSARY)
    ),
  }),
});
