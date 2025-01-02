import { Action, ActionCreator } from '@ngrx/store';
import { Observable } from 'rxjs';

export type PollingItem<T> = T;

export type PollingAction<T = void> = T extends void
  ? ActionCreator<string, () => Action<string>>
  : ActionCreator<string, (props: T) => T & Action<string>>;

export interface Polling {
  startPolling(): Observable<Action<string>>;

  stopPolling(): Observable<Action<string>>;
}
