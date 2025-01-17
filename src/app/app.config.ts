import { provideHttpClient } from '@angular/common/http';
import {
  ApplicationConfig,
  isDevMode,
  makeEnvironmentProviders,
  provideExperimentalZonelessChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideOAuthClient } from 'angular-oauth2-oidc';
import { routes } from './app.routes';
import { TaskRunner } from './feature/task/runner';
import { taskRunnerFactory } from './feature/task/runner.factory';
import { provideApollo } from './providers/apollo.provider';
import { provideAuthConfig } from './providers/authConfig.provider';
import { provideSentry } from './providers/sentry.provider';
import { accountEffects } from './store/account/account.effects';
import { accountFeature } from './store/account/account.reducer';
import { applicationFeature } from './store/application/application.reducers';
import { authEffects } from './store/auth/auth.effects';
import { eventsEffects } from './store/events/events.effects';
import { eventsFeature } from './store/events/events.reducer';
import { imageEffects } from './store/images/images.effects';
import { imagesFeature } from './store/images/images.reducer';
import { navigationEffects } from './store/navigation/navigation.effects';
import { navigationFeature } from './store/navigation/navigation.reducer';
import { previewEffects } from './store/preview/preview.effects';
import { previewFeature } from './store/preview/preview.reducers';
import { tableOfYearsEffects } from './store/table-of-contents/table-of-contents.effects';
import { tableOfYearFeature } from './store/table-of-contents/table-of-contents.reducer';
import { taskEffects } from './store/task/task.effects';
import { taskFeature } from './store/task/task.reducer';
import { timelineEffects } from './store/timeline/timeline.effects';
import { timelineFeature } from './store/timeline/timeline.reducer';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideOAuthClient(),
    provideSentry(),
    provideApollo(),
    provideStore({
      [applicationFeature.name]: applicationFeature.reducer,
      [timelineFeature.name]: timelineFeature.reducer,
      [eventsFeature.name]: eventsFeature.reducer,
      [tableOfYearFeature.name]: tableOfYearFeature.reducer,
      [previewFeature.name]: previewFeature.reducer,
      [accountFeature.name]: accountFeature.reducer,
      [imagesFeature.name]: imagesFeature.reducer,
      [navigationFeature.name]: navigationFeature.reducer,
      [taskFeature.name]: taskFeature.reducer,
    }),
    provideEffects([
      authEffects,
      timelineEffects,
      eventsEffects,
      tableOfYearsEffects,
      previewEffects,
      accountEffects,
      imageEffects,
      navigationEffects,
      taskEffects,
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
    makeEnvironmentProviders([
      {
        provide: TaskRunner,
        useFactory: taskRunnerFactory,
      },
    ]),
  ],
};
