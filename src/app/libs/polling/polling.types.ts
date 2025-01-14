import { Actions } from '@ngrx/effects';
import { Action, ActionCreator } from '@ngrx/store';
import { Observable } from 'rxjs';

export type PollingItem<T> = T;
//eslint-disable-next-line sonarjs/redundant-type-aliases
export type PollingActionProps = unknown;

export type PollingAction<T = void> = T extends void
  ? ActionCreator<string, () => Action<string>>
  : ActionCreator<string, (props: T) => T & Action<string>>;

export interface PollingOptions<T extends PollingActionProps, K> {
  startPollingAction: PollingAction<T>;
  stopPollingAction: PollingAction<void>;
  continuePollingAction: PollingAction<T>;

  selectPollingItems: (actions: Actions) => Observable<PollingItem<K>[]>;
  convertToActionProps(items: K[]): PollingActionProps;
  continuePollingEffect(
    observable: Observable<ReturnType<PollingAction<T>>>
  ): Observable<Action<string>>;
}

export interface Polling {
  startPolling(): Observable<Action<string>>;
  stopPolling(): Observable<Action<string>>;
  continuePolling(): Observable<Action<string>>;
}
