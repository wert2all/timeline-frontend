import { Observable } from 'rxjs';

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
