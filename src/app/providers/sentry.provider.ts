import { ErrorHandler, makeEnvironmentProviders } from '@angular/core';
import { Router } from '@angular/router';
import * as Sentry from '@sentry/angular';

export const provideSentry = () =>
  makeEnvironmentProviders([
    {
      provide: ErrorHandler,
      useValue: Sentry.createErrorHandler({
        showDialog: false,
      }),
    },
    {
      provide: Sentry.TraceService,
      deps: [Router],
    },
  ]);
