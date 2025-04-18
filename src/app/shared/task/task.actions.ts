import { createActionGroup, props } from '@ngrx/store';
import { TaskActionProps, TaskType } from './task.types';

export const TaskActions = createActionGroup({
  source: 'Task',
  events: {
    'Create task': props<{ task: TaskActionProps }>(),
    'Process task': props<{ id: number; task: TaskActionProps }>(),
    'Success task': props<{ id: number; taskType: TaskType; data: unknown }>(),
    'Failed task': props<{ id: number; error: Error; taskType: TaskType }>(),
  },
});
