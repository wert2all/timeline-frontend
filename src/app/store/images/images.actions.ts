import { createActionGroup, props } from '@ngrx/store';
import { Status, Undefined } from '../../app.types';

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
