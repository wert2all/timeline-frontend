import { TaskType } from '../../store/task/task.types';
import { imageTaskExecutor } from './executors/images.executor';
import { TaskRunner } from './runner';

export const taskRunnerFactory = () => {
  return new TaskRunner({
    [TaskType.LOAD_IMAGES]: imageTaskExecutor(),
  });
};
