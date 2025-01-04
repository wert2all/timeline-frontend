import { Injectable } from '@angular/core';
import { Polling } from './polling.types';

@Injectable({
  providedIn: 'root',
})
export class PollingFactory {
  create(): Polling {
    return {
      startPolling: () => {},
      stopPolling: () => {},
      continuePolling: () => {},
    };
  }
}
