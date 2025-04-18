import { createFeature, createReducer, createSelector } from '@ngrx/store';
import { TaskState } from './task.types';

const initState: TaskState = { tasks: {} };

export const taskFeature = createFeature({
  name: 'tasks',
  reducer: createReducer(initState),
  extraSelectors: ({ selectTasks }) => ({
    selectMaxTaskId: createSelector(selectTasks, tasks =>
      Math.max(
        ...[0, Object.keys(tasks)]
          .map(id => Number(id))
          .filter(id => isFinite(id))
      )
    ),
  }),
});
