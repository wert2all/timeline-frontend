import { inject } from '@angular/core';
import { ImagesTaskExecutorFactory } from './executors/images.factory';
import { TaskRunner } from './runner';

export const taskRunnerFactory = (image = inject(ImagesTaskExecutorFactory)) =>
  new TaskRunner([image]);
