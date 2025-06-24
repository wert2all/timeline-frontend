import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { catchError, first, map, Observable, of, switchMap, timer } from 'rxjs';
import { StoreDispatchEffect } from '../../app.types';
import { TaskRunner } from '../../feature/task/runner';
import { ExecutorResult } from '../../feature/task/task.types';
import { TaskActions } from './task.actions';
import { taskFeature } from './task.reducer';

const pollUntilPredicateHandler = <T>(result: ExecutorResult<T>): boolean =>
  result.status === 'done';

const pollUntil =
  <T>(pollInterval: number, responsePredicate: (res: T) => boolean) =>
  (source$: Observable<T>) =>
    timer(0, pollInterval).pipe(
      switchMap(() => source$),
      first(responsePredicate)
    );

const createTask = (actions$ = inject(Actions), store = inject(Store)) =>
  actions$.pipe(
    ofType(TaskActions.createTask),
    concatLatestFrom(() =>
      store.select(taskFeature.selectMaxTaskId).pipe(map(maxId => ++maxId))
    ),
    map(([{ task }, id]) => TaskActions.processTask({ id, task }))
  );

const processTask = (actions$ = inject(Actions), runner = inject(TaskRunner)) =>
  actions$.pipe(
    ofType(TaskActions.processTask),
    switchMap(({ task, id }) =>
      runner.run(task).pipe(
        pollUntil<ExecutorResult<unknown>>(3000, pollUntilPredicateHandler),
        map(result =>
          TaskActions.successTask({
            id,
            data: result.data,
            taskType: task.type,
          })
        ),
        catchError(err =>
          of(TaskActions.failedTask({ error: err, id, taskType: task.type }))
        )
      )
    )
  );

export const taskEffects = {
  createTask: createEffect(createTask, StoreDispatchEffect),
  processTask: createEffect(processTask, StoreDispatchEffect),
};
