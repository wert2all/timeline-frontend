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
import { routes } from './app.routes';
import { provideApollo } from './providers/apollo.provider';
import { authEffects } from './store/auth/auth.effects';
import { authFeature } from './store/auth/auth.reducer';
import { previewEffects } from './store/preview/preview.effects';
import { previewFeature } from './store/preview/preview.reducers';
import { tableOfYearsEffects } from './store/table-of-years/table-of-years.effects';
import { tableOfYearFeature } from './store/table-of-years/table-of-years.reducer';
import {
  eventsEffects,
  timelineEffects,
} from './store/timeline/timeline.effects';
import { timelineFeature } from './store/timeline/timeline.reducer';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideApollo(),
    provideStore({
      [authFeature.name]: authFeature.reducer,
      [timelineFeature.name]: timelineFeature.reducer,
      [tableOfYearFeature.name]: tableOfYearFeature.reducer,
      [previewFeature.name]: previewFeature.reducer,
    }),
    provideEffects([
      authEffects,
      timelineEffects,
      eventsEffects,
      tableOfYearsEffects,
      previewEffects,
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
  ],
};
