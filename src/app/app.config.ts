import { provideHttpClient } from '@angular/common/http';
import {
  ApplicationConfig,
  isDevMode,
  makeEnvironmentProviders,
  provideExperimentalZonelessChangeDetection,
} from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideOAuthClient } from 'angular-oauth2-oidc';
import { routes } from './app.routes';
import { accountEffects } from './feature/account/store/account.effects';
import { accountFeature } from './feature/account/store/account.reducer';
import { previewEffects } from './feature/authorized/dashboard/store/preview/preview.effects';
import { previewFeature } from './feature/authorized/dashboard/store/preview/preview.reducers';
import { timelineEffects as legacyTimelineEffects } from './feature/authorized/dashboard/store/timeline/timeline.effects';
import { timelineFeature as legacyTimelineFeature } from './feature/authorized/dashboard/store/timeline/timeline.reducer';
import { eventOperationsEffects } from './feature/events/store/operations/operations.effects';
import { eventOperationsFeature } from './feature/events/store/operations/operations.reducer';
import { TaskRunner } from './feature/task/runner';
import { taskRunnerFactory } from './feature/task/runner.factory';
import { timelineEffects } from './feature/timeline/store/timeline.effects';
import { timelineFeature } from './feature/timeline/store/timeline.reducers';
import { modalWindowFeature } from './feature/ui/layout/store/modal-window/modal-window.reducers';
import { tableOfYearsEffects } from './feature/ui/table-of-contents/store/table-of-contents/table-of-contents.effects';
import { tableOfYearFeature } from './feature/ui/table-of-contents/store/table-of-contents/table-of-contents.reducer';
import { provideApollo } from './providers/apollo.provider';
import { provideAuthConfig } from './providers/authConfig.provider';
import { metaReducers } from './providers/meta.reducers';
import { provideSentry } from './providers/sentry.provider';
import { imageEffects } from './shared/store/images/images.effects';
import { imagesFeature } from './shared/store/images/images.reducer';
import { navigationEffects } from './shared/store/navigation/navigation.effects';
import { navigationFeature } from './shared/store/navigation/navigation.reducer';
import { sharedEffects } from './shared/store/shared/shared.effects';
import { sharedFeature } from './shared/store/shared/shared.reducers';
import { taskEffects } from './store/task/task.effects';
import { taskFeature } from './store/task/task.reducer';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(),
    provideOAuthClient(),
    provideSentry(),
    provideApollo(),
    provideStore(
      {
        [sharedFeature.name]: sharedFeature.reducer,
        [imagesFeature.name]: imagesFeature.reducer,
        [tableOfYearFeature.name]: tableOfYearFeature.reducer,
        [accountFeature.name]: accountFeature.reducer,
        [navigationFeature.name]: navigationFeature.reducer,
        [taskFeature.name]: taskFeature.reducer,
        [modalWindowFeature.name]: modalWindowFeature.reducer,
        [timelineFeature.name]: timelineFeature.reducer,
        [eventOperationsFeature.name]: eventOperationsFeature.reducer,
        [previewFeature.name]: previewFeature.reducer,
        [legacyTimelineFeature.name]: legacyTimelineFeature.reducer,
      },
      { metaReducers }
    ),
    provideEffects([
      sharedEffects,
      imageEffects,
      tableOfYearsEffects,
      accountEffects,
      navigationEffects,
      taskEffects,
      timelineEffects,
      eventOperationsEffects,
      previewEffects,
      legacyTimelineEffects,
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
