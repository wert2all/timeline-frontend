import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { AccountActions } from '../account/account.actions';
import { ApplicationActions } from './application.actions';
import { ApplicationState, CookieCategory } from './application.types';

const initialState: ApplicationState = {
  loading: false,
  cookie: [],
  windowType: null,
};

export const applicationFeature = createFeature({
  name: 'application',
  reducer: createReducer(
    initialState,

    on(
      ApplicationActions.dispatchCookieConsent,
      (state, { cookie }): ApplicationState => ({
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
      AccountActions.successSaveAccount,
      (state): ApplicationState => ({
        ...state,
        windowType: null,
      })
    ),
    on(
      ApplicationActions.opensModalWindow,
      (state, { windowType }): ApplicationState => ({
        ...state,
        windowType,
      })
    ),

    on(
      ApplicationActions.closeModalWindow,
      (state): ApplicationState => ({
        ...state,
        windowType: null,
      })
    )
  ),
  extraSelectors: ({ selectCookie }) => ({
    canUseNecessaryCookies: createSelector(selectCookie, cookie =>
      cookie.includes(CookieCategory.NECESSARY)
    ),
  }),
});
