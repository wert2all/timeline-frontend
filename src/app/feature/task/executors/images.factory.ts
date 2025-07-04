import { inject, Injectable } from '@angular/core';
import { catchError, concat, map, Observable, of, toArray } from 'rxjs';
import { previewlyApiClient } from '../../../api/external/previewly/graphql';
import { Status } from '../../../app.types';
import { apiAssertNotNull, extractApiData } from '../../../libs/api.functions';
import { UploadedImage } from '../../../shared/store/images/images.types';
import { TaskActionProps, TaskType } from '../../../shared/task/task.types';
import {
  ExecutorResult,
  TaskExecutor,
  TaskExecutorFactory,
  TaskOption,
} from '../task.types';

export interface TaskResultImages {
  images: UploadedImage[];
}

const OPTION_SEPARATOR = ',';
const IDS_OPTION_NAME = 'ids';
const TOKEN_OPTION_NAME = 'token';

@Injectable({ providedIn: 'root' })
export class ImagesTaskExecutorFactory
  implements TaskExecutorFactory<TaskResultImages>
{
  private api = inject(previewlyApiClient);

  createExecutor(): TaskExecutor<TaskResultImages> {
    return (
      options: TaskOption[]
    ): Observable<ExecutorResult<TaskResultImages>> => {
      const token = this.extractTokenFromOptions(options);
      if (!token) {
        throw new Error('Empty token');
      }

      return concat(
        ...this.extractIdFromOptions(options).map(imageId =>
          this.api.getResizedImage({ imageId, token }).pipe(
            map(result =>
              apiAssertNotNull(extractApiData(result), 'Empty resized image')
            ),
            map((image): UploadedImage => {
              if (
                image.resized_490x250?.image?.url &&
                image.cropped_50x50?.image?.url &&
                image.cropped_260x260?.image?.url
              ) {
                return {
                  id: imageId,
                  data: {
                    resized_490x250: image.resized_490x250.image.url,
                    avatar: {
                      small: image.cropped_50x50.image.url,
                      full: image.cropped_260x260.image.url,
                    },
                  },
                  status: Status.SUCCESS,
                  error: null,
                };
              }

              throw new Error('Empty image URL');
            }),
            catchError(error =>
              of({
                id: imageId,
                status: Status.ERROR,
                error: error.message,
                data: null,
              })
            )
          )
        )
      ).pipe(
        toArray(),
        map(
          (images): ExecutorResult<TaskResultImages> => ({
            status: 'done',
            data: { images: images },
          })
        )
      );
    };
  }

  static readonly createTaskProps = (
    ids: number[],
    token: string
  ): TaskActionProps => ({
    type: ImagesTaskExecutorFactory.getType(),
    options: [
      { name: IDS_OPTION_NAME, value: ids.join(OPTION_SEPARATOR) },
      { name: TOKEN_OPTION_NAME, value: token },
    ],
  });

  getType = () => ImagesTaskExecutorFactory.getType();
  static readonly getType = (): TaskType => TaskType.LOAD_IMAGES;

  private extractIdFromOptions = (options: TaskOption[]): number[] =>
    options
      .find(option => option.name === IDS_OPTION_NAME)
      ?.value.split(OPTION_SEPARATOR)
      .map(i => Number(i))
      .filter(i => isFinite(i) && i) || [];

  private extractTokenFromOptions(options: TaskOption[]): string | undefined {
    return options.find(option => option.name === TOKEN_OPTION_NAME)?.value;
  }
}
