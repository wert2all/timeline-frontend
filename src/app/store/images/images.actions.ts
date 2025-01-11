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

    'Maybe should remove images': props<{ images: number[] }>(),

    'Dispatch deleting images': props<{ images: number[] }>(),
    'Success deleting images': props<{ images: number[] }>(),

    'Should not load empty image list': emptyProps(),
  },
});
