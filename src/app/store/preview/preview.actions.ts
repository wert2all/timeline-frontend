import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { DataWrapper } from '../../app.types';
import { PreviewItem } from './preview.types';

export const PreviewActions = createActionGroup({
  source: 'Preview',
  events: {
    'Add URL': props<{ url: URL }>(),
    'Success adding URL': props<{
      url: string;
      preview: DataWrapper<PreviewItem>;
    }>(),

    'Start polling previews': props<{ urls: URL[] }>(),
    'Stop polling previews': emptyProps(),
    'Continue polling previews': emptyProps(),

    'Success update previews': props<{
      previews: {
        url: string;
        preview: DataWrapper<PreviewItem>;
      }[];
    }>(),

    'Update previews': props<{ urls: URL[] }>(),
  },
});
