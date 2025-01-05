import { inject } from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import { interval, map, switchMap, takeUntil } from 'rxjs';
import {
  Polling,
  PollingAction,
  PollingActionProps,
  PollingItem,
  PollingOptions,
} from './polling.types';

export const createPolling = <T extends PollingActionProps, K>(
  options: PollingOptions<T, K>,
  delay = 3000,
  actions$ = inject(Actions)
): Polling => ({
  startPolling: () =>
    options
      .selectPollingItems(actions$)
      .pipe(
        map(
          shouldContinue(
            options.startPollingAction,
            options.stopPollingAction,
            options.convertToActionProps
          )
        )
      ),

  stopPolling: () =>
    options
      .selectPollingItems(actions$)
      .pipe(
        map(
          shouldContinue(
            options.continuePollingAction,
            options.stopPollingAction,
            options.convertToActionProps
          )
        )
      ),

  continuePolling: () =>
    options.continuePollingEffect(
      actions$.pipe(
        ofType(options.startPollingAction),
        switchMap(action =>
          interval(delay).pipe(
            takeUntil(actions$.pipe(ofType(options.stopPollingAction))),
            map(() => action)
          )
        )
      )
    ),
});

const shouldContinue =
  <T extends PollingActionProps, K>(
    action: PollingAction<T>,
    stopAction: PollingAction<void>,
    convert: (items: K[]) => PollingActionProps
  ) =>
  (items: PollingItem<K>[]) =>
    items.length > 0 ? action(convert(items)) : stopAction();
