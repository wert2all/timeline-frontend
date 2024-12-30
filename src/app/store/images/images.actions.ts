import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Status, Undefined } from '../../app.types';
import { PollingActionProps } from '../../libs/polling/polling.types';
import { UploadedImage } from './images.types';

export type ImagesPollingActionProps = PollingActionProps & {
  images: number[];
};

export const UploadActions = createActionGroup({
  source: 'Upload',
  events: {
    'Upload image': props<{ image: File }>(),
    'Success upload image': props<{
      id: number;
      status: Status;
      error: Undefined | string;
    }>(),
    'Failed upload image': props<{ error: string }>(),
  },
});

export const ImagesActions = createActionGroup({
  source: 'Images',
  events: {
    'Dispatch polling': emptyProps(),
    'Success update images': props<{ images: UploadedImage[] }>(),

    'Start polling': props<ImagesPollingActionProps>(),
    'Continue polling': props<ImagesPollingActionProps>(),
    'Stop polling': emptyProps(),
  },
});
