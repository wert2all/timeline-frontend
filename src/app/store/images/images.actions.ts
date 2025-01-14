import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Status, Undefined, Unique } from '../../app.types';
import { PollingActionProps } from '../../libs/polling/polling.types';
import { UploadedImage } from './images.types';

export type ImagesPollingActionProps = PollingActionProps & {
  images: number[];
};

export const UploadActions = createActionGroup({
  source: 'Upload',
  events: {
    'Upload image': props<Unique & { image: File }>(),
    'Success upload image': props<
      Unique & {
        id: number;
        status: Status;
        error: Undefined | string;
      }
    >(),
    'Failed upload image': props<Unique & { error: string }>(),
  },
});

export const ImagesActions = createActionGroup({
  source: 'Images',
  events: {
    'Dispatch polling': emptyProps(),
    'Success update images': props<{ images: UploadedImage[] }>(),

    'Maybe should delete image': props<{ imageId: number | Undefined }>(),
    'Dispatch delete images': props<{ images: number[] }>(),
    'Success deleting images': props<{ images: number[] }>(),

    'Should not load empty image list': emptyProps(),
  },
});
