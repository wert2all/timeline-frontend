import { Observable } from 'rxjs';
import { TaskActionProps, TaskType } from '../../store/task/task.types';
import { ExecutorResult, TaskExecutor } from './task.types';

export class TaskRunner<T> {
  constructor(private executors: Record<TaskType, TaskExecutor<T>>) {}

  run(task: TaskActionProps): Observable<ExecutorResult<T>> {
    return this.executors[task.type](task.options);
  }
}
