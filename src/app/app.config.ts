import { provideHttpClient } from '@angular/common/http';
import {
  ApplicationConfig,
  isDevMode,
  provideExperimentalZonelessChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideOAuthClient } from 'angular-oauth2-oidc';
import { routes } from './app.routes';
import { provideApollo } from './providers/apollo.provider';
import { provideAuthConfig } from './providers/authConfig.provider';
import { provideSentry } from './providers/sentry.provider';
import { accountEffects } from './store/account/account.effects';
import { accountFeature } from './store/account/account.reducer';
import { authEffects } from './store/auth/auth.effects';
import { navigationEffects } from './store/navigation/navigation.effects';
import { navigationFeature } from './store/navigation/navigation.reducer';
import { previewEffects } from './store/preview/preview.effects';
import { previewFeature } from './store/preview/preview.reducers';
import { tableOfYearsEffects } from './store/table-of-contents/table-of-contents.effects';
import { tableOfYearFeature } from './store/table-of-contents/table-of-contents.reducer';
import {
  eventsEffects,
  timelineEffects,
} from './store/timeline/timeline.effects';
import { timelineFeature } from './store/timeline/timeline.reducer';
import { uploadEffects } from './store/upload/upload.effects';
import { uploadFeature } from './store/upload/upload.reducer';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideOAuthClient(),
    provideSentry(),
    provideApollo(),
    provideStore({
      [timelineFeature.name]: timelineFeature.reducer,
      [tableOfYearFeature.name]: tableOfYearFeature.reducer,
      [previewFeature.name]: previewFeature.reducer,
      [accountFeature.name]: accountFeature.reducer,
      [uploadFeature.name]: uploadFeature.reducer,
      [navigationFeature.name]: navigationFeature.reducer,
    }),
    provideEffects([
      authEffects,
      timelineEffects,
      eventsEffects,
      tableOfYearsEffects,
      previewEffects,
      accountEffects,
      uploadEffects,
      navigationEffects,
    ]),
    provideStoreDevtools({
      maxAge: 25, // Retains last 25 states
      logOnly: !isDevMode(), // Restrict extension to log-only mode
      autoPause: true, // Pauses recording actions and state changes when the extension window is not open
      trace: false, //  If set to true, will include stack trace for every dispatched action, so you can see it in trace tab jumping directly to that part of code
      traceLimit: 75, // maximum stack trace frames to be stored (in case trace option was provided as true)
      connectInZone: true, // If set to true, the connection is established within the Angular zone
    }),
    provideExperimentalZonelessChangeDetection(),
    provideAuthConfig(),
  ],
};
