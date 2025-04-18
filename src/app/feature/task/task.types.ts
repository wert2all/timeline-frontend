import { Observable } from 'rxjs';
import { TaskType } from '../../shared/task/task.types';

export interface ExecutorResult<T> {
  status: 'done' | 'pending';
  data?: T;
}

export interface TaskOption {
  name: string;
  value: string;
}

export type TaskExecutor<T> = (
  options: TaskOption[]
) => Observable<ExecutorResult<T>>;

export interface TaskExecutorFactory<T> {
  createExecutor(): TaskExecutor<T>;
  getType(): TaskType;
}
