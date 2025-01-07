import { Observable } from 'rxjs';
import { TaskType } from '../../store/task/task.types';

export type ExecutorResult<T> = {
  status: 'done' | 'pending';
  data?: T;
};

export type TaskOption = {
  name: string;
  value: string;
};

export type TaskExecutor<T> = (
  options: TaskOption[]
) => Observable<ExecutorResult<T>>;

export interface TaskExecutorFactory<T> {
  createExecutor(): TaskExecutor<T>;
  getType(): TaskType;
}
