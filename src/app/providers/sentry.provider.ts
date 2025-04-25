import { ErrorHandler, makeEnvironmentProviders } from '@angular/core';
import { Router } from '@angular/router';
import * as Sentry from '@sentry/angular';
import { ErrorHandler as AppErrorHandler } from '../shared/handlers/error.handler';
export const provideSentry = () =>
  makeEnvironmentProviders([
    {
      provide: ErrorHandler,
      useValue: () => new AppErrorHandler(),
    },
    {
      provide: Sentry.TraceService,
      deps: [Router],
    },
  ]);
