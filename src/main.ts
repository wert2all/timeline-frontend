import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

import * as Sentry from '@sentry/angular';
import { environment } from './environments/environment';

Sentry.init({
  dsn: environment.services.sentry.dsn,
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],
  tracesSampleRate: 1,
  // Set `tracePropagationTargets` to control for which URLs distributed tracing should be enabled
  tracePropagationTargets: [],

  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
});

bootstrapApplication(AppComponent, appConfig).catch(err => console.error(err));
