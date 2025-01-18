import { createFeature, createReducer, on } from '@ngrx/store';
import { ApplicationActions } from './application.actions';
import { ApplicationState, CookieCategory } from './application.types';

const initialState: ApplicationState = { loading: false, cookie: [] };

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
    )
  ),
});
