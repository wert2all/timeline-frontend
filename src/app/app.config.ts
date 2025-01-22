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
import { modalWindowFeature } from './feature/ui/layout/store/modal-window/modal-window.reducers';
import { tableOfYearsEffects } from './feature/ui/table-of-contents/store/table-of-contents/table-of-contents.effects';
import { tableOfYearFeature } from './feature/ui/table-of-contents/store/table-of-contents/table-of-contents.reducer';
import { provideApollo } from './providers/apollo.provider';
import { provideAuthConfig } from './providers/authConfig.provider';
import { provideSentry } from './providers/sentry.provider';
import { imageEffects } from './shared/store/images/images.effects';
import { imagesFeature } from './shared/store/images/images.reducer';
import { navigationEffects } from './shared/store/navigation/navigation.effects';
import { navigationFeature } from './shared/store/navigation/navigation.reducer';
import { sharedEffects } from './shared/store/shared/shared.effects';
import { sharedFeature } from './shared/store/shared/shared.reducers';
import { accountEffects } from './store/account/account.effects';
import { accountFeature } from './store/account/account.reducer';
import { taskEffects } from './store/task/task.effects';
import { taskFeature } from './store/task/task.reducer';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideOAuthClient(),
    provideSentry(),
    provideApollo(),
    provideStore({
      [sharedFeature.name]: sharedFeature.reducer,
      [imagesFeature.name]: imagesFeature.reducer,
      [tableOfYearFeature.name]: tableOfYearFeature.reducer,
      [accountFeature.name]: accountFeature.reducer,
      [navigationFeature.name]: navigationFeature.reducer,
      [taskFeature.name]: taskFeature.reducer,
      [modalWindowFeature.name]: modalWindowFeature.reducer,
    }),
    provideEffects([
      sharedEffects,
      imageEffects,
      tableOfYearsEffects,
      accountEffects,
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
