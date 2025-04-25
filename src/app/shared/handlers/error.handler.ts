import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import * as Sentry from '@sentry/angular';
import { SharedActions } from '../store/shared/shared.actions';
import { ErrorMessage } from './error.types';

@Injectable({ providedIn: 'root' })
export class ErrorHandler extends Sentry.SentryErrorHandler {
  private readonly store = inject(Store);

  constructor() {
    super({ logErrors: false, showDialog: false });
  }

  handle(message: ErrorMessage) {
    this.logMessage(message).notify(message);
  }

  override handleError(error: unknown): void {
    // Your custom error handling logic
    // Call Sentry's error handler to capture errors:
    super.handleError(error);
  }

  private logMessage(message: ErrorMessage): ErrorHandler {
    if (message.log) {
      this.handleError(new Error(message.message));
    }
    return this;
  }
  private notify(message: ErrorMessage) {
    if (message.notify) {
      this.store.dispatch(
        SharedActions.sendNotification({
          message: message.message,
          withType: message.type || 'error',
        })
      );
    }
  }
}
