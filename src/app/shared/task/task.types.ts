import { Iterable } from '../../app.types';
import { TaskOption } from '../../feature/task/task.types';

export enum TaskType {
  LOAD_IMAGES = 'LOAD_IMAGES',
}

export enum TaskResultStatus {
  COMPLITED = 'COMPLITED',
  FAILED = 'FAILED',
  PENDING = 'PENDING',
}

export interface TaskActionProps {
  type: TaskType;
  options: TaskOption[];
}

export type Task = Iterable & {
  result: TaskResult<unknown>;
};

export interface TaskResult<T> {
  status: TaskResultStatus;
  data?: T;
  error?: Error;
}

export interface TaskState {
  tasks: Record<number, Task>;
}
