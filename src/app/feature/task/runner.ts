import { Observable } from 'rxjs';
import { TaskActionProps, TaskType } from '../../store/task/task.types';
import {
  ExecutorResult,
  TaskExecutor,
  TaskExecutorFactory,
} from './task.types';

export class TaskRunner<T> {
  private executors: Record<TaskType, TaskExecutor<T>>;

  constructor(executors: TaskExecutorFactory<T>[]) {
    this.executors = executors.reduce(
      (acc, executor) => {
        acc[executor.getType()] = executor.createExecutor();
        return acc;
      },
      {} as Record<TaskType, TaskExecutor<T>>
    );
  }

  run(task: TaskActionProps): Observable<ExecutorResult<T>> {
    return this.executors[task.type](task.options);
  }
}
